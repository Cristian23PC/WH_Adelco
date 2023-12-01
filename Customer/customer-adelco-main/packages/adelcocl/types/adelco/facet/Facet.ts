export type FacetType = 'variants.attributes.brand' | 'variants.categories.id' | 'masterVariant.availability.isOnStock';

export type Facet = {
  [key in FacetType]?: {
    terms: Array<{
      term: string;
      count: number;
    }>;
    total: number;
  };
};

export type FacetFilter = {
  [key in FacetType]?: string;
};
