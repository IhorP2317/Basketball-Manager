import { StatisticFiltersDto } from './statistic-filters.dto';

export interface MatchStatisticFiltersDto extends StatisticFiltersDto {
  isAccumulativeDisplayEnabled?: boolean | null;
}
