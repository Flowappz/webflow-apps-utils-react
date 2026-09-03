/* eslint-disable @typescript-eslint/no-explicit-any */
export enum DiffType {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  UNCHANGED = 'unchanged',
}

export interface DiffResult {
  type: DiffType;
  data: any;
}

export type DiffMap = {
  [key: string]: DiffResult | DiffMap;
};

export type ComparableValue = any;

class DeepDiffMapper {
  private visitedPairs = new WeakMap<object, WeakSet<object>>();

  private isFunction(x: ComparableValue): x is (...args: any[]) => any {
    return Object.prototype.toString.call(x) === '[object Function]';
  }

  private isArray(x: ComparableValue): x is any[] {
    return Object.prototype.toString.call(x) === '[object Array]';
  }

  private isDate(x: ComparableValue): x is Date {
    return Object.prototype.toString.call(x) === '[object Date]';
  }

  private isObject(x: ComparableValue): x is Record<string, any> {
    return Object.prototype.toString.call(x) === '[object Object]';
  }

  private isValue(x: ComparableValue): boolean {
    return !this.isObject(x) && !this.isArray(x);
  }

  private compareValues(value1: ComparableValue, value2: ComparableValue): DiffType {
    if (value1 === value2 || this.areEquivalentPrimitives(value1, value2)) {
      return DiffType.UNCHANGED;
    }
    if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
      return DiffType.UNCHANGED;
    }
    if (value1 === undefined) {
      return DiffType.CREATED;
    }
    if (value2 === undefined) {
      return DiffType.DELETED;
    }
    return DiffType.UPDATED;
  }

  private areEquivalentPrimitives(value1: ComparableValue, value2: ComparableValue): boolean {
    // Handle null and undefined
    if (value1 == null && value2 == null) {
      return true;
    }

    // Handle string trimming - if both are strings, compare trimmed versions
    if (typeof value1 === 'string' && typeof value2 === 'string') {
      return value1.trim() === value2.trim();
    }

    // Handle string/boolean coercion with specific string values
    if (
      (typeof value1 === 'string' || typeof value1 === 'boolean') &&
      (typeof value2 === 'string' || typeof value2 === 'boolean')
    ) {
      const val1 = typeof value1 === 'string' ? value1.trim().toLowerCase() : value1;
      const val2 = typeof value2 === 'string' ? value2.trim().toLowerCase() : value2;

      // Handle specific string-boolean equivalences
      if (typeof val1 === 'string' && typeof val2 === 'boolean') {
        if ((val1 === 'true' && val2 === true) || (val1 === 'false' && val2 === false)) {
          return true;
        }
        // Handle empty string as false
        if (val1 === '' && val2 === false) {
          return true;
        }
      }
      if (typeof val2 === 'string' && typeof val1 === 'boolean') {
        if ((val2 === 'true' && val1 === true) || (val2 === 'false' && val1 === false)) {
          return true;
        }
        // Handle empty string as false
        if (val2 === '' && val1 === false) {
          return true;
        }
      }
    }

    // Handle string/number coercion
    if (
      (typeof value1 === 'string' || typeof value1 === 'number') &&
      (typeof value2 === 'string' || typeof value2 === 'number')
    ) {
      // For string to number comparison, trim the string first
      const str1 = typeof value1 === 'string' ? value1.trim() : value1.toString();
      const str2 = typeof value2 === 'string' ? value2.trim() : value2.toString();

      // Only treat truly empty strings (not whitespace-only) as equivalent to 0
      // Distinguish between empty string ('') and whitespace-only strings (' ', '  ')
      if (typeof value1 === 'string' && value1 === '' && typeof value2 === 'number') {
        return value2 === 0;
      }
      if (typeof value2 === 'string' && value2 === '' && typeof value1 === 'number') {
        return value1 === 0;
      }

      // Don't treat whitespace-only strings as equivalent to numbers
      if (typeof value1 === 'string' && value1.trim() === '' && value1 !== '') {
        return false; // ' ', '  ', etc. should not be equivalent to numbers
      }
      if (typeof value2 === 'string' && value2.trim() === '' && value2 !== '') {
        return false; // ' ', '  ', etc. should not be equivalent to numbers
      }

      // Convert both to numbers and compare
      const num1 = Number(str1);
      const num2 = Number(str2);

      // Handle NaN case specifically - only consider equal if both are exactly NaN
      if (isNaN(num1) || isNaN(num2)) {
        return Number.isNaN(value1) && Number.isNaN(value2);
      }

      if (!isNaN(num1) && !isNaN(num2)) {
        return num1 === num2;
      }
    }

    return false;
  }

  private hasCircularReference(obj1: ComparableValue, obj2: ComparableValue): boolean {
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
      return false;
    }

    if (!this.visitedPairs.has(obj1)) {
      this.visitedPairs.set(obj1, new WeakSet());
    }

    const visited = this.visitedPairs.get(obj1)!;
    if (visited.has(obj2)) {
      return true;
    }

    visited.add(obj2);
    return false;
  }

  private _map(obj1: ComparableValue, obj2: ComparableValue): DiffResult | DiffMap {
    if (this.isFunction(obj1) || this.isFunction(obj2)) {
      throw new Error('Invalid argument. Function given, object expected.');
    }

    // Only treat as values if both are values, or if one is undefined and the other is also a value
    // This prevents treating undefined vs complex object as a value comparison
    if (this.isValue(obj1) && this.isValue(obj2)) {
      const diffType = this.compareValues(obj1, obj2);
      return {
        type: diffType,
        data: diffType === DiffType.CREATED ? obj2 : obj1,
      };
    }

    // Special case: one is undefined/null and the other is a complex object
    if ((obj1 === undefined || obj1 === null) && (this.isArray(obj2) || this.isObject(obj2))) {
      // Recursively process the non-undefined object as if it was created
      return this._map({}, obj2);
    }
    if ((obj2 === undefined || obj2 === null) && (this.isArray(obj1) || this.isObject(obj1))) {
      // Recursively process the non-undefined object as if it was deleted
      return this._map(obj1, {});
    }

    // Handle primitive value cases (one or both are primitives but not both complex)
    if (this.isValue(obj1) || this.isValue(obj2)) {
      const diffType = this.compareValues(obj1, obj2);
      return {
        type: diffType,
        data: diffType === DiffType.CREATED ? obj2 : obj1,
      };
    }

    // Check if both are complex types but of different specific types (array vs object)
    const isArrayVsObject =
      (this.isArray(obj1) && this.isObject(obj2)) || (this.isObject(obj1) && this.isArray(obj2));

    // For mixed types (array vs object), check if they have the same structure first
    if (isArrayVsObject) {
      // If both are empty, they're still different types
      const keys1 = Object.keys(obj1 || {});
      const keys2 = Object.keys(obj2 || {});

      if (keys1.length === 0 && keys2.length === 0) {
        return {
          type: DiffType.UPDATED,
          data: obj1,
        };
      }
      // Continue with property comparison for non-empty mixed types
    }

    // Check for circular references
    if (this.hasCircularReference(obj1, obj2)) {
      return {
        type: DiffType.UNCHANGED,
        data: obj1,
      };
    }

    const diff: DiffMap = {};

    // Get all property keys including symbols and own properties
    const getAllKeys = (obj: ComparableValue): Array<string | symbol> => {
      if (!obj) return [];
      const keys: Array<string | symbol> = [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)];
      // Include inherited enumerable properties
      for (const key in obj) {
        if (!keys.includes(key)) {
          keys.push(key);
        }
      }
      return keys;
    };

    const keys1 = getAllKeys(obj1);
    const keys2 = getAllKeys(obj2);
    const allKeys = new Set([...keys1, ...keys2]);

    // Check if prototypes are different and add __proto__ to comparison
    const proto1 = obj1 ? Object.getPrototypeOf(obj1) : null;
    const proto2 = obj2 ? Object.getPrototypeOf(obj2) : null;

    // Add __proto__ to comparison if prototypes differ
    if (proto1 !== proto2) {
      allKeys.add('__proto__');
    }

    // Check all properties from both objects
    for (const key of allKeys) {
      if (this.isFunction(obj1?.[key]) || this.isFunction(obj2?.[key])) {
        continue;
      }

      let value1: ComparableValue;
      let value2: ComparableValue;

      // Special handling for __proto__
      if (key === '__proto__') {
        // We already know prototypes differ if we got here (since we added __proto__ to allKeys)
        // For prototypes, we'll do a shallow comparison to avoid infinite recursion
        if (proto1 === proto2) {
          continue; // Should not happen since we only added this key when they differ
        }

        // Compare prototypes - treat default Object.prototype as "undefined" for comparison purposes
        const isDefaultProto1 = proto1 === Object.prototype || proto1 === null;
        const isDefaultProto2 = proto2 === Object.prototype || proto2 === null;

        // If one has default prototype and other has custom, treat as create/delete
        if (isDefaultProto1 && !isDefaultProto2) {
          diff[key as string] = {
            type: DiffType.CREATED,
            data: proto2,
          };
          continue;
        }
        if (!isDefaultProto1 && isDefaultProto2) {
          diff[key as string] = {
            type: DiffType.DELETED,
            data: proto1,
          };
          continue;
        }
        // Both have custom prototypes but they're different
        if (!isDefaultProto1 && !isDefaultProto2 && proto1 !== proto2) {
          diff[key as string] = {
            type: DiffType.UPDATED,
            data: proto1,
          };
          continue;
        }
      } else {
        value1 = obj1?.[key];
        value2 = obj2?.[key];
      }

      diff[key as string] = this._map(value1, value2);
    }

    return diff;
  }

  map(obj1: ComparableValue, obj2: ComparableValue): DiffResult | DiffMap {
    // Reset visited pairs for each new comparison
    this.visitedPairs = new WeakMap();
    return this._map(obj1, obj2);
  }

  compare(obj1: ComparableValue, obj2: ComparableValue): DiffResult | DiffMap {
    return this.map(obj1, obj2);
  }
}

// Export singleton instance
export const deepDiffMapper = new DeepDiffMapper();

// Export class for custom instances if needed
export { DeepDiffMapper };

// Export convenience function
export function compareObjects(obj1: ComparableValue, obj2: ComparableValue): DiffResult | DiffMap {
  return deepDiffMapper.compare(obj1, obj2);
}
