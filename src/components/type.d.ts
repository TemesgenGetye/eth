export interface CategoryType {
  id: number;
  name: string;
  icon_url?: string;
  img_url?: string;

  subcategories: {
    subcategories: { id: number; name: string; img_url: string; category_id: string; } | undefined;
    id: number;
    name: string;
    img_url: string;
    category_id: string;
  }[];
}

export interface Subcategory {
  id: number;
  name: string;
  img_url: string;
  category_id: string;
}
