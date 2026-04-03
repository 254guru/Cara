export interface Product {
  id: number;
  brand: string;
  title: string;
  price: number;
  image: string;
  rating: number;
  fullRating: boolean;
  description?: string;
  category?: string;
  source?: string;
  externalId?: string;
  inStock?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  size: string;
}

export interface BlogPost {
  id: number;
  date: string;
  image: string;
  title: string;
  excerpt: string;
}
