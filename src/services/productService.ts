import { featuredProducts, newArrivals, shopProducts } from '@/data/products';
import { Product } from '@/types';

export function getFeaturedProducts(): Product[] {
  return featuredProducts;
}

export function getNewArrivals(): Product[] {
  return newArrivals;
}

export function getShopProducts(): Product[] {
  return shopProducts;
}

export function getProductById(id: number): Product | undefined {
  return shopProducts.find((p) => p.id === id);
}

export function getAllProductIds(): number[] {
  return shopProducts.map((p) => p.id);
}
