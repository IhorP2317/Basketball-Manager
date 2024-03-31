export interface BaseFiltersDto {
  [key: string]: string | number | boolean | undefined | null;
  searchTerm?: string | null;
  sortColumn?: string | null;
  sortOrder?: string | null;
}
