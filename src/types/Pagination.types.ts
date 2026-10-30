export type PaginationItem = number | "ellipsis-left" | "ellipsis-right";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}
