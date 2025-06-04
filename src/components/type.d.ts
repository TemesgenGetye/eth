export interface Category {
  id: number;
  name: string;
  icon_url?: string;
  img_url?: string;

  subcategories: {
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
