export interface MenuItem {
  title: string;
  slug?: string;
  children?: MenuItem[];
}

export interface PromotionalBanner {
  imageURL: string;
  link: string;
}
