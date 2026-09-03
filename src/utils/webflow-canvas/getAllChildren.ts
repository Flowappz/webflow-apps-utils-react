import { getWebflowElementAttribute } from './attributes';

export interface ElementChildren {
  attribute: string | null;
  customAttributes: NamedValue[] | null;
  element: AnyElement;
  parent: AnyElement | null;
}

/**
 * Recursively fetches children elements and attributes.
 *
 * @param element - The root element.
 * @param attributeName - The attribute name to fetch.
 * @param parent - The parent of the current element.
 * @param className - The class name to fetch.
 * @returns - Promise of array containing elements and their children recursively.
 */
export const getAllChildren = async (
  element: AnyElement,
  attributeName?: string,
  parent?: AnyElement | null,
  className = 'fs-consent'
): Promise<ElementChildren[]> => {
  let attribute: string | null = '';
  let customAttributes: NamedValue[] = [];

  if (attributeName) {
    if (attributeName === 'wized' || attributeName === 'w-el') {
      // wized may have old attribute name "w-el" so we check for both
      attribute =
        (await getWebflowElementAttribute(element, 'wized')) ||
        (await getWebflowElementAttribute(element, 'w-el')) ||
        null;
    } else {
      attribute = (await getWebflowElementAttribute(element, attributeName)) || null;
    }
  }

  if (element?.customAttributes) {
    // Get All Custom Attributes
    const attributesList = await element.getAllCustomAttributes();
    if (attributesList) {
      customAttributes = attributesList;
    }
  }

  const children = element?.children ? await element?.getChildren() : [];

  const current: ElementChildren = {
    element,
    parent: parent ?? null,
    attribute,
    customAttributes
  };

  if (children.length === 0) {
    return [current];
  }

  const childrenArrays = await Promise.all(
    children.map((child) => getAllChildren(child, attributeName, element, className))
  );

  const flattenedChildren = childrenArrays.flat();

  return [current, ...flattenedChildren];
};
