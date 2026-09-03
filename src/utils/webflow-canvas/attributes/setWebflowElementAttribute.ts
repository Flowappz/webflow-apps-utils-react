import { getWebflowElementAttribute } from './getWebflowElementAttribute';

/**
 * Sets a custom attribute value on a Webflow element.
 */
export const setWebflowElementAttribute = async (
  element: AnyElement,
  attributeName: string,
  attributeValue: string,
  notify = true
): Promise<void> => {
  try {
    const attributeExists = await checkAttribute(element, attributeName, attributeValue);

    if (attributeExists) {
      console.error(`Attribute ${attributeName}="${attributeValue}" already exists on the element. Exiting`);
      return;
    }

    if (element?.customAttributes) {
      await element?.setCustomAttribute(attributeName, attributeValue);
      if (notify) {
        webflow.notify({
          type: 'Success',
          message: `Attribute ${attributeName}="${attributeValue}" has been updated successfully.`
        });
      }
      return;
    }

    if (element?.type === 'DOM') {
      await element.setAttribute(attributeName, attributeValue);
      if (notify) {
        webflow.notify({
          type: 'Success',
          message: `Attribute ${attributeName}="${attributeValue}" has been updated successfully.`
        });
      }
      return;
    }

    return;
  } catch (error) {
    console.error('Error in setWebflowElementAttribute:', error);
    return;
  }
};

/**
 * Checks if the specified attribute exists on a Webflow element and matches the provided value.
 */
const checkAttribute = async (element: AnyElement, attributeName: string, attributeValue: string) => {
  const elementAttribute = await getWebflowElementAttribute(element, attributeName);

  const attr = elementAttribute?.toLowerCase()?.trim();
  const comparisonValue = attributeValue?.toLowerCase()?.trim();

  return attr === comparisonValue;
};
