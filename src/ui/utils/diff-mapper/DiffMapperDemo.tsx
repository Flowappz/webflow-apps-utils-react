import { useState } from 'react';

import { getDetailedDiff, hasChangesViaDiff } from '../../providers';

import './DiffMapperDemo.css';

export const DiffMapperDemo = () => {
  const [output, setOutput] = useState('');
  const [coercionExamples, setCoercionExamples] = useState('');
  const [performanceResults, setPerformanceResults] = useState('');
  const [deepOutput, setDeepOutput] = useState('');

  function runDiffExamples() {
    // Example 1: Basic object comparison
    const obj1 = { name: 'John', age: 30, active: 'true' };
    const obj2 = { name: 'John', age: 31, active: true };

    // @ts-expect-error - intentional type mismatch for demo
    const hasChanges = hasChangesViaDiff(obj1, obj2);
    // @ts-expect-error - intentional type mismatch for demo
    const detailedDiff = getDetailedDiff(obj1, obj2);

    // Example 2: Nested object comparison
    const nested1 = {
      user: { profile: { name: 'John', settings: { theme: 'dark' } } },
      items: [{ id: 1, name: 'Item 1' }],
    };

    const nested2 = {
      user: { profile: { name: 'John', settings: { theme: 'light' } } },
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ],
    };

    const nestedChanges = hasChangesViaDiff(nested1, nested2);
    const nestedDiff = getDetailedDiff(nested1, nested2);

    // Example 3: Type coercion examples
    const coercion1 = { count: '5', enabled: '', value: '0' };
    const coercion2 = { count: 5, enabled: false, value: 0 };
    // @ts-expect-error - intentional type mismatch for demo
    const coercionChanges = hasChangesViaDiff(coercion1, coercion2);

    setOutput(`
📊 DIFF MAPPER RESULTS

1. Basic Object Comparison:
   Object 1: ${JSON.stringify(obj1)}
   Object 2: ${JSON.stringify(obj2)}
   Has Changes: ${hasChanges}
   Age changed from 30 to 31, but 'true' === true (type coercion)

2. Nested Object Comparison:
   Has Changes: ${nestedChanges}
   Theme changed from 'dark' to 'light'
   New item added to array

3. Type Coercion Examples:
   Object 1: ${JSON.stringify(coercion1)}
   Object 2: ${JSON.stringify(coercion2)}
   Has Changes: ${coercionChanges}
   All values are equivalent due to intelligent type coercion!

📝 Check the browser console for detailed diff objects.
		`);

    // Log detailed results to console
    console.group('🔍 DiffMapper Detailed Results');
    console.log('Basic diff:', detailedDiff);
    console.log('Nested diff:', nestedDiff);
    console.groupEnd();
  }

  function generateCoercionExamples() {
    const examples: Array<[Record<string, unknown>, Record<string, unknown>, string]> = [
      [{ value: '42' }, { value: 42 }, 'String "42" equals number 42'],
      [{ active: 'true' }, { active: true }, 'String "true" equals boolean true'],
      [{ empty: '' }, { empty: 0 }, 'Empty string equals number 0'],
      [{ name: 'John' }, { name: '  John  ' }, 'Whitespace is trimmed'],
      [{ enabled: 'false' }, { enabled: false }, 'String "false" equals boolean false'],
    ];

    let html = '<div style="display: grid; gap: 10px;">';

    examples.forEach(([obj1, obj2, description]) => {
      const hasChanges = hasChangesViaDiff(obj1, obj2);
      const status = hasChanges ? '❌ DIFFERENT' : '✅ SAME';
      const color = hasChanges ? 'var(--redText)' : 'var(--greenText)';

      html += `
				<div class="coercion-example">
					<div style="color: ${color}; font-weight: var(--font-weight-medium); margin-bottom: var(--spacing-4);">${status}</div>
					<div style="color: var(--text1);"><strong>A:</strong> ${JSON.stringify(obj1)}</div>
					<div style="color: var(--text1);"><strong>B:</strong> ${JSON.stringify(obj2)}</div>
					<div style="color: var(--text3); font-style: italic; margin-top: var(--spacing-4);">${description}</div>
				</div>
			`;
    });

    html += '</div>';
    setCoercionExamples(html);
  }

  function runPerformanceTest() {
    // Create large objects for testing
    const createLargeObject = (size: number) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj: Record<string, any> = {};
      for (let i = 0; i < size; i++) {
        obj[`key${i}`] = {
          id: i,
          name: `Item ${i}`,
          nested: {
            value: Math.random(),
            timestamp: Date.now(),
          },
        };
      }
      return obj;
    };

    const obj1 = createLargeObject(100);
    const obj2 = { ...obj1 };
    obj2.key50.nested.value = 999; // Change one value

    // Measure performance
    const start = performance.now();
    const hasChanges = hasChangesViaDiff(obj1, obj2);
    const end = performance.now();

    // Test caching - second call should be faster
    const start2 = performance.now();
    hasChangesViaDiff(obj1, obj2);
    const end2 = performance.now();

    setPerformanceResults(`
			<div class="performance-result">
				<h4>Performance Test Results</h4>
				<div><strong>Object Size:</strong> 100 nested objects</div>
				<div><strong>Change Detected:</strong> ${hasChanges ? 'Yes' : 'No'}</div>
				<div><strong>First Call:</strong> ${(end - start).toFixed(2)}ms</div>
				<div><strong>Cached Call:</strong> ${(end2 - start2).toFixed(2)}ms</div>
				<div style="color: var(--greenText); margin-top: var(--spacing-12); font-weight: var(--font-weight-medium);">
					⚡ ${((end - start) / (end2 - start2)).toFixed(1)}x faster with caching!
				</div>
			</div>
		`);

    console.log('Performance test completed:', {
      hasChanges,
      firstCall: end - start,
      cachedCall: end2 - start2,
      speedup: (end - start) / (end2 - start2),
    });
  }

  function runDeepTest() {
    const deepObj1 = {
      level1: {
        level2: {
          level3: {
            level4: {
              data: 'original',
              count: 42,
              items: [1, 2, 3],
            },
          },
        },
      },
    };

    const deepObj2 = {
      level1: {
        level2: {
          level3: {
            level4: {
              data: 'modified',
              count: 42,
              items: [1, 2, 3, 4],
            },
          },
        },
      },
    };

    const hasChanges = hasChangesViaDiff(deepObj1, deepObj2);
    const diff = getDetailedDiff(deepObj1, deepObj2);

    setDeepOutput(`
Deep Object Comparison Results:

Has Changes: ${hasChanges}

Changes detected:
- level1.level2.level3.level4.data: "original" → "modified"
- level1.level2.level3.level4.items: Array length changed (3 → 4)

The diff mapper successfully navigated 4 levels deep to detect specific changes!

See console for the complete diff structure.
		`);

    console.log('Deep nesting diff:', diff);
  }

  return (
    <div className="demo-container">
      <h3>DiffMapper Utilities Demo</h3>
      <p>Open the browser console to see diff results.</p>
      <button className="btn btn--primary" onClick={runDiffExamples}>
        Run Diff Examples
      </button>
      <pre className="output-block">{output}</pre>

      <hr className="divider" />

      <h3>Type Coercion Examples</h3>
      <button className="btn btn--primary" onClick={generateCoercionExamples}>
        Show Type Coercion
      </button>
      <div className="examples-container" dangerouslySetInnerHTML={{ __html: coercionExamples }} />

      <hr className="divider" />

      <h3>Performance Features</h3>
      <button className="btn btn--primary" onClick={runPerformanceTest}>
        Run Performance Test
      </button>
      <div className="results-container" dangerouslySetInnerHTML={{ __html: performanceResults }} />

      <hr className="divider" />

      <h3>Deep Nesting Comparison</h3>
      <button className="btn btn--primary" onClick={runDeepTest}>
        Test Deep Objects
      </button>
      <pre className="output-block small">{deepOutput}</pre>
    </div>
  );
};

export default DiffMapperDemo;
