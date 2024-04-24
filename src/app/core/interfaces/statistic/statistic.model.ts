import { PlayerExperienceDetail } from '../staff-experience/player-experience-detail.model';

export interface Statistic {
  matchId: string;
  playerExperienceId: string;
  timeUnit: number;
  onePointShotHitCount: number;
  onePointShotMissCount: number;
  twoPointShotHitCount: number;
  twoPointShotMissCount: number;
  threePointShotHitCount: number;
  threePointShotMissCount: number;
  assistCount: number;
  offensiveReboundCount: number;
  defensiveReboundCount: number;
  stealCount: number;
  blockCount: number;
  turnoverCount: number;
  courtTime: string;
  playerExperience: PlayerExperienceDetail;
}
