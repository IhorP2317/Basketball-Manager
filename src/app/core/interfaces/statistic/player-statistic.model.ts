export interface PlayerStatistic {
  fullName: string;
  teamId?: string | null;
  points: number;
  onePointShotHit: number;
  onePointShotMiss: number;
  twoPointShotHit: number;
  twoPointShotMiss: number;
  threePointShotHit: number;
  threePointShotMiss: number;
  assists: number;
  offensiveRebounds: number;
  defensiveRebounds: number;
  steals: number;
  blocks: number;
  turnovers: number;
  courtTime: string;
}
