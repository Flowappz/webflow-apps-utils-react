interface CustomCodeAttributes {
  async: string;
  type: string;
  siteId: string;
  finsweet: 'components' | 'consentpro';
}

export interface CustomCodeBlock {
  id?: string;
  displayName?: string;
  location: string;
  hostedLocation?: string;
  sourceCode?: string;
  attributes: CustomCodeAttributes;
  canCopy: boolean;
}
