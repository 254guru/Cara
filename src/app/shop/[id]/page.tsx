import { getAllProductIds, getProductByIdFromDB } from '@/services/productService';
import { completeTheLook } from '@/lib/semantic';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const ids = await getAllProductIds();
  return ids.map((id) => ({ id: String(id) }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductByIdFromDB(parseInt(id, 10));

  if (!product) {
    return {
      title: 'Product not found',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.title} by ${product.brand}`,
    description: `Explore ${product.title} from ${product.brand} with pricing, sizing, and quick mobile checkout at Cara Stores.`,
    openGraph: {
      title: `${product.title} | Cara Stores`,
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
  const numericId = parseInt(id, 10);
  const product = await getProductByIdFromDB(numericId);
  if (!product) notFound();
  const recommendations = await completeTheLook(numericId, 4);

  return <ProductDetailClient product={product} recommendations={recommendations} />;
}
