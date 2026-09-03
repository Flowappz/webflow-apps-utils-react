export interface StyleProps {
  name: string;
  style: PropertyMap;
}

/**
 * Creates or updates styles and applies them to the selected element.
 */
export const setStyles = async (styles: StyleProps[], element: AnyElement): Promise<void> => {
  const promises = styles.map(async ({ name, style }) => {
    if (!element?.styles) return null;

    const existingStyles = (await webflow.getAllStyles()) || [];
    const filteredStyles = existingStyles?.filter((s) => !!s);

    const matchPromises = filteredStyles.map(async (s) => {
      const existingName = await s?.getName();
      if (name === existingName) {
        return s;
      }
    });

    const match = (await Promise.all(matchPromises))?.find((s) => !!s) || null;

    // Update existing style
    if (match) {
      // get existing props and update it
      const existing = await match?.getProperties();
      await match.setProperties({ ...existing, ...style });
      return;
    }

    // Create new style
    const newStyle = await webflow.createStyle(name);

    if (newStyle) {
      // Set properties for the style
      newStyle?.setProperties({ ...style });

      // Add the new style and Apply style to selected element
      await element?.setStyles([...filteredStyles, newStyle]);
    }
  });

  await Promise.all(promises);
};
