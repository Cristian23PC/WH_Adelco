import { LocalizedField } from '@Types/adelco/general/LocalizedField';

interface CtAncestorsExpanded {
  obj: {
    slug: LocalizedField;
    name: LocalizedField;
  };
}

export interface CtCategoryExpanded {
  slug: LocalizedField;
  name: LocalizedField;
  ancestors: CtAncestorsExpanded[];
}
