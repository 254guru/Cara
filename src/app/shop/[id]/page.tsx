import { shopProducts } from '@/data/products';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return shopProducts.map((p) => ({ id: String(p.id) }));
}

export const metadata = {
  title: 'Cara Store - Product Detail',
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = shopProducts.find((p) => p.id === parseInt(id));
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
