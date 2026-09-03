/**
 * Inserts a template into the Designer Canvas using XSCP APIs.
 */
export const insertWithXSCP = async (template: string): Promise<void> => {
  try {
    // @ts-expect-error - typings not available for xscp
    await webflow._internal.xscp(template);
  } catch (error) {
    throw new Error(`Failed to insert template with XSCP: ${error}`, { cause: error });
  }
};
