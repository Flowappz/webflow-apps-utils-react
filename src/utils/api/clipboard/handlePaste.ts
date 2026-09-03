import type { XSCPMetadata } from '../../../types';

/**
 * Processes pasted component data to validate Finsweet components.
 */
export const processPastedComponent = (
  pasteData: XSCPMetadata,
  component: string
):
  | {
      data: XSCPMetadata;
      key: string;
    }
  | undefined => {
  const valid = pasteData?.payload?.nodes?.some((node) =>
    node?.data?.xattr?.some((attr) => {
      if (component === 'consent') {
        // consent is kinda different
        const bannerFound = attr.name.includes(`fs-consent-element`) && attr.value === 'banner';
        const wrapperFound = attr.name.includes(`fs-consent-element`) && attr.value === 'wrapper';
        return bannerFound || wrapperFound;
      }

      return attr.name.includes(`fs-${component}-instance`);
    })
  );

  if (valid) {
    return { data: pasteData, key: component };
  }
};

/**
 * Handles pasting of Webflow components from clipboard.
 */
export const handlePasteXSCP = (
  e: ClipboardEvent,
  component: string
):
  | {
      data: XSCPMetadata;
      key: string;
    }
  | undefined => {
  if (!e.clipboardData?.types.includes('application/json')) return;

  const data = e.clipboardData?.getData('application/json');
  const clipboard = JSON.parse(data);

  if (clipboard?.type === '@webflow/XscpData') {
    try {
      const data = e.clipboardData.getData('application/json');
      const clipboard = JSON.parse(data);

      if (clipboard?.type === '@webflow/XscpData') {
        return processPastedComponent(clipboard, component);
      }

      webflow.notify({
        type: 'Error',
        message: 'Invalid! You can only paste valid Finsweet Components.'
      });
    } catch (error) {
      console.error({}, 'handlePasteXSCP failed with error', error);
      webflow.notify({
        type: 'Error',
        message: 'Invalid! You can only paste valid Finsweet Components.'
      });
      return;
    }
  }
};
