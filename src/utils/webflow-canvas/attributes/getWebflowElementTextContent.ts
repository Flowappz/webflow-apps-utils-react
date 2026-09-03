/**
 * Gets the text content of a Webflow element.
 */
export const getWebflowElementTextContent = async (selectedElement: AnyElement): Promise<string> => {
  const textContent: string[] = [];

  if (selectedElement?.textContent && selectedElement?.children) {
    // Get Child Elements
    const children = await selectedElement.getChildren();

    // Filter string elements from children
    const strings = children.filter((child) => child.type === 'String');

    // Initialize an array to hold text content
    // Loop over string elements to get text
    for (const myString of strings) {
      if (myString.type === 'String') {
        const text = await myString.getText();
        if (text) textContent.push(text);
      }
    }
  }

  if (textContent.length === 0) return '';

  return textContent.join(' ');
};
