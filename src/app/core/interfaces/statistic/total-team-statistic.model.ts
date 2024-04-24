export interface TotalTeamStatisticModel {
  name: string;
  points: number;

  onePointShotsCompleted: number;
  onePointShotsMissed: number;

  twoPointShotsCompleted: number;
  twoPointShotsMissed: number;
  threePointShotsCompleted: number;
  threePointShotsMissed: number;
  assists: number;
  offensiveRebounds: number;
  defensiveRebounds: number;
  steals: number;
  blocks: number;
  turnOvers: number;
  onePointShotPercentage: number;
  twoPointShotPercentage: number;
  threePointShotPercentage: number;
}
