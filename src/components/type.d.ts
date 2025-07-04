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
  price: {
    orignal: number;
    discounted?: number | null;
    currency: string;
  };
  stock: number;
  imgUrls: string[];
  views: number;
  description: string;
  status: string;
  category?: {
    id: number;
    name: string;
  };
  subcategory?: {
    id: number;
    name: string;
  };
  createdBy?: number;
}

export interface ProductData {
  name?: string;
  description?: string;
  price: {
    orignal: number;
    discounted?: number | null;
    currency?: string;
  };
  stock?: number;
  imgUrls?: File[];
  category_id: number;
  subcategory_id: number;
  location?: string;
  contact_name?: string;
  phone_num?: string;
  email?: string | null;
}

export type Product = {
  id: number;
  name: string;
  price: {
    discounted: number;
    orignal: number;
  };
  imgUrls: string[];
  slug: string;
  description: string;
  stock: number;
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  };
  quantity?: number;
};
