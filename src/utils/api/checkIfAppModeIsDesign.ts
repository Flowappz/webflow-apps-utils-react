/**
 * Checks if the app mode is design and shows error notification if not.
 */
export const checkIfAppModeIsDesign = async (): Promise<boolean> => {
  const capabilities = await webflow.canForAppMode([webflow.appModes.canDesign, webflow.appModes.canEdit]);

  if (capabilities.canDesign) {
    // Proceed with the action
    return true;
  }

  // Provide feedback to the user
  await webflow.notify({
    type: 'Error',
    message:
      'This action cannot be performed right now. Ensure you are working in the Primary Locale, on the Main Branch, and in design mode.'
  });

  return false;
};
