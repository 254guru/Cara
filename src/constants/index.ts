export const PRODUCT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;
export type ProductSize = (typeof PRODUCT_SIZES)[number];

export const SHIPPING_OPTIONS = [
  { value: 'nbi-same-day', label: 'Nairobi same-day delivery' },
  { value: 'nbi-next-day', label: 'Nairobi next-day delivery' },
  { value: 'pickup', label: 'Nairobi CBD pickup station' },
] as const;

export const PAYMENT_METHODS = [
  { value: 'mpesa', label: 'M-Pesa' },
  { value: 'airtel-money', label: 'Airtel Money' },
] as const;

export const NAV_LINKS = [
  { href: '/', label: 'home' },
  { href: '/shop', label: 'shop' },
  { href: '/blog', label: 'blog' },
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' },
] as const;
