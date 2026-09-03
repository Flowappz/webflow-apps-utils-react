import { noop } from '../helpers';
import { getWebflowElementAttribute } from './attributes';

export interface ElementFromComponentMatch {
  element: AnyElement;
  component: ComponentElement | null;
  globalIndex: number;
  selected: boolean;
}

export interface GetElementFromComponentProps {
  targetIndex: number;
  instance: string;
  component: string;
  allElements?: AnyElement[];
  signal?: AbortSignal;
  selectElement?: boolean;
}

export interface FindElementByReferenceProps {
  element: AnyElement;
  allElements: AnyElement[];
  attribute: {
    name: string;
    value: string;
  };
}

/**
 * Exits the current component context.
 */
const exitComponent = async () => {
  try {
    await webflow.exitComponent();
  } catch (error) {
    noop(error);
  }
};

/**
 * Searches for an instance inside or outside a component by its index.
 */
export const findInstanceElement = async ({
  targetIndex,
  instance,
  component,
  allElements,
  signal,
  selectElement = false
}: GetElementFromComponentProps): Promise<ElementFromComponentMatch | null> => {
  if (signal?.aborted) return null;

  let attribute: { name: string; value: string };

  if (component === 'consent') {
    // for cookie consent, just selecting the banner should be enough
    attribute = {
      name: 'fs-consent-element',
      value: 'banner'
    };
  } else {
    attribute = {
      name: `fs-${component}-instance`,
      value: instance
    };
  }

  try {
    // Ensure we start at the root level
    await webflow.exitComponent();

    if (signal?.aborted) return null;

    const all = allElements || (await webflow.getAllElements());

    if (signal?.aborted) return null;

    let currentIndex = 0;

    const componentInstancesMap = new Map<string, AnyComponent>();

    for (const element of all) {
      if (signal?.aborted) {
        await exitComponent();
        return null;
      }

      if (element.type === 'ComponentInstance') {
        const component = await element.getComponent();
        if (component) {
          componentInstancesMap.set(element.id.toString(), component);
        }
      }

      // Check elements outside components first
      const elementAttribute = await getWebflowElementAttribute(element, attribute.name);

      if (signal?.aborted) {
        await exitComponent();
        return null;
      }

      if (elementAttribute === attribute.value) {
        currentIndex += 1;

        if (currentIndex === targetIndex) {
          if (selectElement) {
            await webflow.setSelectedElement(element);
          }

          return {
            element,
            component: null,
            globalIndex: currentIndex,
            selected: selectElement
          };
        }
      }

      // If it's a component, we might need to enter it
      if (element.type === 'ComponentInstance') {
        const component = componentInstancesMap.get(element.id.toString());
        if (!component) continue;

        await webflow.enterComponent(element);

        // Check for cancellation after entering component
        if (signal?.aborted) {
          await exitComponent();
          return null;
        }

        const componentElements = await webflow.getAllElements();

        // Check for cancellation after getting component elements
        if (signal?.aborted) {
          await exitComponent();
          return null;
        }

        for (const innerElement of componentElements) {
          // Check for cancellation in inner loop
          if (signal?.aborted) {
            await exitComponent();
            return null;
          }

          const innerAttribute = await getWebflowElementAttribute(innerElement, attribute.name);

          // Check for cancellation after async operation
          if (signal?.aborted) {
            await exitComponent();
            return null;
          }

          if (innerAttribute === attribute.value) {
            currentIndex += 1;

            if (currentIndex === targetIndex) {
              if (selectElement) {
                // We're already inside the component, so just select the element
                await webflow.setSelectedElement(innerElement);
              } else {
                // Exit component if we're not selecting the element
                await webflow.exitComponent();
              }

              return {
                element: innerElement,
                component: element,
                globalIndex: currentIndex,
                selected: selectElement
              };
            }
          }
        }

        await webflow.exitComponent();
      }
    }

    return null;
  } catch (error) {
    console.error({}, 'Error in findInstanceInsideOrOutsideComponent:', error);
    throw error;
  }
};
