import SpecificCategoryScreen from "@/features/categories/components/specificCategory.screen";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SpecificCategoryScreen id={id} />;
}
