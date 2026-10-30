import ProductDetailsScreen from "@/features/products/components/ProductDetails/productDetails";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailsScreen productId={id} />;
}
