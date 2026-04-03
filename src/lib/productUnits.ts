import { PRODUCT_SIZES } from '@/constants';
import type { Product } from '@/types';

type ProductLike = Partial<Pick<Product, 'title' | 'category' | 'description'>>;

export type ProductUnitConfig = {
  label: string;
  options: string[];
};

const SHOE_SIZE_OPTIONS = ['38', '39', '40', '41', '42', '43', '44'];
const WAIST_OPTIONS = ['28', '30', '32', '34', '36', '38', '40'];
const VOLUME_OPTIONS = ['100 ml', '200 ml', '400 ml', '500 ml'];
const STANDARD_OPTIONS = ['Standard'];

function getProductText(product: ProductLike): string {
  return `${product.title || ''} ${product.category || ''} ${product.description || ''}`.toLowerCase();
}

function hasKeyword(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

export function getProductUnitConfig(product: ProductLike): ProductUnitConfig {
  const text = getProductText(product);

  if (hasKeyword(text, ['lotion', 'cream', 'serum', 'gel', 'body wash', 'shampoo', 'conditioner', 'mist', 'perfume', 'spray'])) {
    return { label: 'Volume', options: VOLUME_OPTIONS };
  }

  if (hasKeyword(text, ['shoe', 'sneaker', 'boot', 'loafer', 'heel', 'sandal'])) {
    return { label: 'Shoe size', options: SHOE_SIZE_OPTIONS };
  }

  if (hasKeyword(text, ['jean', 'pant', 'trouser', 'short', 'skirt', 'legging'])) {
    return { label: 'Waist', options: WAIST_OPTIONS };
  }

  if (hasKeyword(text, ['shirt', 't-shirt', 'tee', 'hoodie', 'jacket', 'coat', 'blouse', 'top', 'dress', 'sweater'])) {
    return { label: 'Size', options: [...PRODUCT_SIZES] };
  }

  return { label: 'Option', options: STANDARD_OPTIONS };
}

export function getDefaultProductUnit(product: ProductLike): string {
  return getProductUnitConfig(product).options[0] || 'Standard';
}