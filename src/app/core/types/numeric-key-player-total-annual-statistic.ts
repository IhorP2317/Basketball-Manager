import { TotalAnnuallyPlayerStatistic } from '../interfaces/statistic/total-annually-player-statistic.model';

export type NumericKeysOfPlayerTotalAnnualStatistic = Exclude<
  keyof TotalAnnuallyPlayerStatistic,
  'year' | 'courtTime'
>;
