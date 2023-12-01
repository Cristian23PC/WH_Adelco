import { LocalizedField } from "../general";

interface Ancestor {
  id: string;
}

export interface CtCategory {
  id: string;
  name: LocalizedField,
  slug: LocalizedField,
  children: CtCategory[];
  ancestors?: Ancestor[]
}
