export interface PagedListConfiguration {
  page: number;
  pageSize: number;

  [key: string]: string | number | boolean | undefined | null;
}
