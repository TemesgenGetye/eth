export interface CategoryType {
  id: number;
  name: string;
  iconUrl?: string;
  imgUrl?: string;
  subcategories: {
    subcategories:
      | { id: number; name: string; img_url: string; category_id: string }
      | undefined;
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

export interface ProductType {
  id: number;
  name: string;
  price: { orignal: number; discounted?: number; currency?: string };
  stock: number;
  imgUrls: string[];
  views: number;
  description: string;
  category: CategoryType;
  subcategory: Subcategory;
  createdBy?: number | string; // Add this line for seller reference
}
