export interface Category {
  title: string;
  slug: string;
  children?: Category[];
}
