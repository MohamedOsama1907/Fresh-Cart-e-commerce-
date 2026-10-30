import SpecificSubcategoryScreen from "@/features/subcategories/components/specificSubcategory.screen";

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <SpecificSubcategoryScreen id={id} />;
}
