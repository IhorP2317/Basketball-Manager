export interface StatisticFiltersDto {
  teamId?: string | null;
  timeUnit?: number | null;

  [key: string]: string | number | boolean | undefined | null;
}
