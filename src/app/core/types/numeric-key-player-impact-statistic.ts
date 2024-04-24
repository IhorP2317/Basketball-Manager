import { PlayerImpactStatisticModel } from '../interfaces/statistic/player-impact-statistic.model';

export type NumericKeysOfPlayerImpactStatisticModel = Exclude<
  keyof PlayerImpactStatisticModel,
  'fullName' | 'teamId'
>;
