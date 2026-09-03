/**
 * Removes a custom attribute from a Webflow element.
 */
export const removeWebflowElementAttribute = async (
  element: AnyElement,
  attributeName: string,
  notify = true
): Promise<null | undefined> => {
  try {
    if (element?.customAttributes) {
      element?.removeCustomAttribute(attributeName);
      if (notify) {
        webflow.notify({
          type: 'Success',
          message: `The attribute "${attributeName}" was removed successfully.`
        });
      }
      return;
    }

    if (element?.type === 'DOM') {
      element?.removeAttribute(attributeName);
      if (notify) {
        webflow.notify({
          type: 'Success',
          message: `The attribute "${attributeName}" was removed successfully.`
        });
      }
      return;
    }

    return;
  } catch (error) {
    console.error('Error in removeWebflowElementAttribute:', error);
    return null;
  }
};
