type ClassList = {
  name: string;
  style: Style;
};

/**
 * Returns the class list of the element
 */
export const getElementClassList = async (element: AnyElement): Promise<ClassList[]> => {
  const classList: ClassList[] = [];

  if (element?.styles) {
    const stylesData = await element.getStyles();

    const isArray = Array.isArray(stylesData);

    if (isArray) {
      for (const style of stylesData) {
        const clsName = await style?.getName();
        if (style && clsName) {
          classList.push({ name: clsName, style });
        }
      }
    }
  }

  return classList?.filter(Boolean);
};
