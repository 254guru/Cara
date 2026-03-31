import { getAllProductIds, getProductById } from '@/services/productService';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getAllProductIds().map((id) => ({ id: String(id) }));
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
  const product = getProductById(parseInt(id, 10));
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}
