export const PRODUCT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;
export type ProductSize = (typeof PRODUCT_SIZES)[number];

export const SHIPPING_OPTIONS = [
  { value: 'dd', label: 'door delivery' },
  { value: 'ps', label: 'pickUp station' },
  { value: 'md', label: 'merchant delivery' },
] as const;

export const NAV_LINKS = [
  { href: '/', label: 'home' },
  { href: '/shop', label: 'shop' },
  { href: '/blog', label: 'blog' },
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' },
] as const;
