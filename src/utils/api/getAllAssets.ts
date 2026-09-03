export interface AllAssets {
  name: string;
  url: string;
  mimeType: string;
  altText: string;
  asset: Asset;
}

/**
 * Gets all assets from the Webflow Canvas with their metadata.
 */
export const getAllAssets = async (): Promise<AllAssets[]> => {
  const assets = await webflow.getAllAssets();

  const assetPromises = assets.map(async (asset) => {
    const url = await asset.getUrl();
    const name = await asset.getName();
    const mimeType = await asset.getMimeType();
    const altText = (await asset.getAltText()) ?? '';

    return {
      name,
      url,
      mimeType,
      altText,
      asset
    };
  });

  return await Promise.all(assetPromises);
};
