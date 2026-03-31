import { getAllProductIds, getProductById } from '@/services/productService';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return getAllProductIds().map((id) => ({ id: String(id) }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(parseInt(id, 10));

  if (!product) {
    return {
      title: 'Product not found',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.title} by ${product.brand}`,
    description: `Explore ${product.title} from ${product.brand} with pricing, sizing, and quick mobile checkout at Cara Studio.`,
    openGraph: {
      title: `${product.title} | Cara Studio`,
      description: `Shop ${product.title} by ${product.brand}.`,
      images: [product.image],
    },
  };
}

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
