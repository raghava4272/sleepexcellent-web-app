import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/product-detail-page";
import { readCatalogueProduct } from "@/lib/catalogue/repository";

export const dynamic = "force-dynamic";

type RouteProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await readCatalogueProduct(slug);
  if (!product.product) return { title: "Product not found" };

  return {
    title: product.product.name,
    description: `View the supplied SleepExcellent ${product.product.name} details.`,
  };
}

export default async function ProductDetailRoute({ params }: RouteProps) {
  const { slug } = await params;
  const result = await readCatalogueProduct(slug);

  if (result.error || !result.product) notFound();

  return <ProductDetailPage product={result.product} source={result.source} />;
}
