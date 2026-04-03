import type { Product } from '@/types';

export interface Discount {
  pct: number;
  wasPrice: number;
}

/**
 * Returns a deterministic pseudo-discount for a product, or null if no discount.
 * Same product ID always produces the same result — no DB column needed.
 */
export function getProductDiscount(product: Pick<Product, 'id' | 'price'>): Discount | null {
  // Knuth multiplicative hash — well distributed, repeatable
  const seed = (product.id * 2654435761) >>> 0;
  // ~40 % of products show a discount (when seed % 5 is 0 or 1)
  if (seed % 5 > 1) return null;
  const pct = 10 + (seed % 35); // 10 – 44 % off
  const wasPrice = product.price / (1 - pct / 100);
  return { pct, wasPrice };
}

export type CategoryGroup = {
  label: string;
  slug: string;
  icon: string;
  keywords: string[];
};

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    label: 'Fashion',
    slug: 'fashion',
    icon: 'fa-tshirt',
    keywords: ['tops', 'womens', 'mens', 'shirt', 'dress', 'clothing', 'fashion', 'jacket', 'blouse', 'skirt', 'jeans', "women's", "men's", 'hoodie', 'sweater'],
  },
  {
    label: 'Electronics',
    slug: 'electronics',
    icon: 'fa-mobile-alt',
    keywords: ['smartphone', 'laptop', 'computer', 'electronics', 'tablet', 'gadget', 'phone', 'headphone', 'speaker', 'camera', 'tv', 'monitor'],
  },
  {
    label: 'Beauty',
    slug: 'beauty',
    icon: 'fa-magic',
    keywords: ['beauty', 'skincare', 'fragrance', 'serum', 'lotion', 'moisturiz', 'makeup', 'cosmetic', 'perfume', 'cream', 'face', 'body wash', 'shampoo', 'conditioner'],
  },
  {
    label: 'Footwear',
    slug: 'footwear',
    icon: 'fa-shoe-prints',
    keywords: ['shoes', 'footwear', 'sneaker', 'boot', 'sandal', 'heel', 'slipper', 'loafer'],
  },
  {
    label: 'Accessories',
    slug: 'accessories',
    icon: 'fa-gem',
    keywords: ['watch', 'jewel', 'jewellery', 'jewelry', 'sunglasses', 'bag', 'accessories', 'wallet', 'belt', 'purse', 'bracelet', 'necklace', 'ring', 'earring'],
  },
  {
    label: 'Home',
    slug: 'home',
    icon: 'fa-couch',
    keywords: ['home', 'furniture', 'decoration', 'kitchen', 'living', 'lighting', 'bedding', 'curtain', 'chair', 'table', 'sofa', 'cushion'],
  },
  {
    label: 'Groceries',
    slug: 'groceries',
    icon: 'fa-shopping-basket',
    keywords: ['groceries', 'food', 'drink', 'snack', 'beverage', 'fruit', 'vegetable', 'cereal'],
  },
  {
    label: 'Automotive',
    slug: 'automotive',
    icon: 'fa-car',
    keywords: ['automotive', 'motorcycle', 'vehicle', 'scooter', 'motorbike', 'bike', 'motor', 'tyre', 'car'],
  },
];

export function matchProductCategory(
  product: { category?: string | null; title?: string | null },
): string | null {
  const haystack = `${product.category ?? ''} ${product.title ?? ''}`.toLowerCase();
  for (const group of CATEGORY_GROUPS) {
    if (group.keywords.some((kw) => haystack.includes(kw))) {
      return group.slug;
    }
  }
  return null;
}
