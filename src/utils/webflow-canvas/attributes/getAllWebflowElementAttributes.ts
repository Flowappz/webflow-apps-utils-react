/**
 * Gets all custom attributes from a Webflow element.
 */
export const getAllWebflowElementAttributes = async (element: AnyElement): Promise<NamedValue[] | null> => {
  try {
    if (element?.customAttributes) {
      return await element?.getAllCustomAttributes();
    }
    return null;
  } catch (error) {
    console.error({}, 'Error in getAllWebflowElementAttributes:', error);
    return null;
  }
};
