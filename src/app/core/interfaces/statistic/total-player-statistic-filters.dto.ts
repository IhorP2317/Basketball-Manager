export interface TotalPlayerStatisticFiltersDto {
  year?: number | null;

  [key: string]: string | number | boolean | undefined | null;
}
