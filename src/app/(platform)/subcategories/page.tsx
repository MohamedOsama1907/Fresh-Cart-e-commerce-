import AllSubcategoriesScreen from "@/features/subcategories/components/allSubcategories.screen";

export default async function SubcategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { page: pageParam } = await searchParams;
  const parsedPage = Number(Array.isArray(pageParam) ? pageParam[0] : pageParam);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  return <AllSubcategoriesScreen page={page} />;
}
