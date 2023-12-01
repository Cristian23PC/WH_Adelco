export type FacetType = 'variants.attributes.brand' | 'variants.categories.id';

export type Facet = {
  [key in FacetType]: {
    terms: Array<{
      term: string;
      count: number;
    }>;
    total: number;
  }
};

export type FacetFilter = {
  [key in FacetType]: string;
};
