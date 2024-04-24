export interface TotalAnnuallyPlayerStatistic {
  year: number;
  matchCount: number;
  points: number;
  onePtShotCount: number;
  twoPtShotCount: number;
  threePtShotCount: number;
  onePtShotMissCount: number;
  twoPtShotMissCount: number;
  threePtShotMissCount: number;
  assistCount: number;
  offensiveReboundCount: number;
  defensiveReboundCount: number;
  stealCount: number;
  blockCount: number;
  turnOverCount: number;
  courtTime: string;
  onePointShotPercentage: number;
  twoPointShotPercentage: number;
  threePointShotPercentage: number;
}
