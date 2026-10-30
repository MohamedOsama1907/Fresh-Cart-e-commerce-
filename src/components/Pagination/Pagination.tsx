import Link from "next/link";
import type { PaginationItem, PaginationProps } from "../../types/Pagination.types";

function getPaginationItems(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages]);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page >= 1 && page <= totalPages) pages.add(page);
  }

  if (currentPage <= 3) {
    for (let page = 2; page <= Math.min(4, totalPages); page += 1) {
      pages.add(page);
    }
  }

  if (currentPage >= totalPages - 2) {
    for (let page = Math.max(1, totalPages - 3); page < totalPages; page += 1) {
      pages.add(page);
    }
  }

  const sortedPages = [...pages].sort((left, right) => left - right);
  const items: PaginationItem[] = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];
    if (previousPage !== undefined) {
      const gap = page - previousPage;
      if (gap === 2) items.push(previousPage + 1);
      if (gap > 2) {
        items.push(
          previousPage === 1 ? "ellipsis-left" : "ellipsis-right",
        );
      }
    }
    items.push(page);
  });

  return items;
}

function pageHref(basePath: string, page: number) {
  return `${basePath}?page=${page}`;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = getPaginationItems(currentPage, totalPages);
  const linkClassName =
    "flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition-colors hover:border-primary-600 hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600";
  const disabledClassName =
    "flex min-h-10 items-center justify-center rounded-lg border border-slate-100 px-3 text-sm font-medium text-slate-300";

  return (
    <nav aria-label="Product pagination" className="mt-10 flex justify-center">
      <ul className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <li>
          {currentPage > 1 ? (
            <Link
              href={pageHref(basePath, currentPage - 1)}
              rel="prev"
              className={linkClassName}
            >
              <span className="sm:hidden" aria-hidden="true">‹</span>
              <span className="hidden sm:inline">Previous</span>
              <span className="sr-only sm:hidden">Previous page</span>
            </Link>
          ) : (
            <span aria-disabled="true" className={disabledClassName}>
              <span className="sm:hidden" aria-hidden="true">‹</span>
              <span className="hidden sm:inline">Previous</span>
              <span className="sr-only sm:hidden">Previous page</span>
            </span>
          )}
        </li>

        {items.map((item, index) => (
          <li key={typeof item === "number" ? item : `${item}-${index}`}>
            {typeof item === "number" ? (
              <Link
                href={pageHref(basePath, item)}
                aria-label={`Page ${item}`}
                aria-current={item === currentPage ? "page" : undefined}
                className={`${linkClassName} ${
                  item === currentPage
                    ? "border-primary-600 bg-primary-600 text-white hover:text-white"
                    : ""
                }`}
              >
                {item}
              </Link>
            ) : (
              <span
                aria-hidden="true"
                className="flex min-h-10 min-w-7 items-center justify-center text-slate-400"
              >
                …
              </span>
            )}
          </li>
        ))}

        <li>
          {currentPage < totalPages ? (
            <Link
              href={pageHref(basePath, currentPage + 1)}
              rel="next"
              className={linkClassName}
            >
              <span className="sm:hidden" aria-hidden="true">›</span>
              <span className="hidden sm:inline">Next</span>
              <span className="sr-only sm:hidden">Next page</span>
            </Link>
          ) : (
            <span aria-disabled="true" className={disabledClassName}>
              <span className="sm:hidden" aria-hidden="true">›</span>
              <span className="hidden sm:inline">Next</span>
              <span className="sr-only sm:hidden">Next page</span>
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
