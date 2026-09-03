export type PageWithProps = {
  slug: string;
  page: Page | Folder;
  parent: Folder | null;
  name: string;
  kind: 'static' | 'ecommerce' | 'cms' | 'userSystems' | 'utility' | 'staticTemplate';
  url: URL;
  isDraft: boolean;
  isPasswordProtected: boolean;
};

let pageStagingUrl: string | undefined;

/**
 * Generates a slug for a page or folder.
 */
export const getPathname = async (page: Page | Folder): Promise<string> => {
  const parent = await page.getParent();
  const slug = await page.getSlug();

  let fullSlug;

  if (parent) {
    fullSlug = `${await getPathname(parent)}/${slug}`;
  } else {
    fullSlug = slug;
  }

  // Ensure the slug starts with a forward slash
  return fullSlug.startsWith('/') ? fullSlug : `/${fullSlug}`;
};

/**
 * Returns a single page with all its properties.
 */
export const getPageMetadata = async (page: Page, targetUrl?: URL): Promise<PageWithProps> => {
  if (!pageStagingUrl) {
    const { domains } = await webflow.getSiteInfo();
    const stagingUrl = domains.find((domain) => domain.stage === 'staging')?.url;
    pageStagingUrl = targetUrl?.toString() || `https://${stagingUrl}`;
  }

  const [fullPath, parent, name, kind, isDraft, isPasswordProtected, generatedPathname] = await Promise.all([
    page?.getPublishPath(),
    page?.getParent(),
    page?.getName(),
    page?.getKind(),
    page?.isDraft(),
    page?.isPasswordProtected(),
    getPathname(page)
  ]);

  // Create a full URL for the page
  const fullUrl = new URL(pageStagingUrl);
  if (fullPath) fullUrl.pathname = generatedPathname;

  return {
    slug: generatedPathname,
    page,
    parent,
    name: name || 'Homepage',
    kind,
    url: fullUrl,
    isDraft,
    isPasswordProtected
  };
};

/**
 * Returns all pages and folders from the Webflow project.
 */
export const getAllPages = async (
  pagesAndFolders?: boolean,
  kind?: PageWithProps['kind'],
  targetUrl?: URL
): Promise<PageWithProps[]> => {
  try {
    const allPages = await webflow?.getAllPagesAndFolders();

    const pagesWithPropsPromises: Promise<PageWithProps>[] = [];

    if (allPages) {
      for (const page of allPages) {
        if (page.type === 'PageFolder') continue;

        pagesWithPropsPromises.push(getPageMetadata(page, targetUrl));
      }
    }

    const list = await Promise.all(pagesWithPropsPromises);

    if (list?.length === 0) return [];

    if (pagesAndFolders) return list;

    const pagesOnly = list.filter(({ page }) => {
      if (page.type === 'Page') return true;
      return false;
    });

    // return pages that match the kind
    if (kind) {
      return pagesOnly.filter((page) => page.kind === kind);
    }

    return pagesOnly;
  } catch (error) {
    console.error({}, 'getAllPages failed with an error:', error);
    return [];
  }
};
