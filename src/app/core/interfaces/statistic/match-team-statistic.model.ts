import { PlayerStatistic } from './player-statistic.model';

export interface MatchTeamStatistic {
  name: string;
  statistics: PlayerStatistic[];
}
