import { Country } from '@angular-material-extensions/select-country';

export const PLAYER_FILTER_POSITIONS = [
  { value: 'All positions' },
  { value: 'Guard' },
  { value: 'Forward' },
  { value: 'Center' },
];
export const PLAYER_ACTIONS_POSITIONS = [
  { value: 'Guard' },
  { value: 'Forward' },
  { value: 'Center' },
];
export const USER_ROLES = [
  { value: 'All roles' },
  { value: 'User' },
  { value: 'Admin' },
  { value: 'SuperAdmin' },
];
export const USER_ACTIONS_ROLES = [{ value: 'User' }, { value: 'Admin' }];
export const COACH_ACTIONS_STATUSES = [
  { value: 'Head' },
  { value: 'Assistant' },
  { value: 'Personal' },
];
export const COACH_ACTIONS_SPECIALITIES = [
  { value: 'Balanced' },
  { value: 'Offense' },
  { value: 'Defense' },
];
export const EMAIL_STATUSES = [
  { value: 'All statuses' },
  { value: 'Confirmed' },
  { value: 'Unconfirmed' },
];
export const MATCH_ACTIONS_STATUSES = [
  { value: 'Scheduled' },
  { value: 'Ongoing' },
  { value: 'Completed' },
];
export const DEFAULT_COUNTRY: Country = {
  name: 'Ukraine',
  alpha2Code: 'UA',
  alpha3Code: 'UKR',
  numericCode: '804',
  callingCode: '+380',
};
export const STATISTICAL_SHARES = [
  { key: 'onePointShotMakeShare', display: '1PT Shot Made %' },
  { key: 'onePointShotMissShare', display: '1PT Shot Missed %' },
  { key: 'twoPointShotMakeShare', display: '2PT Shot Made %' },
  { key: 'twoPointShotMissShare', display: '2PT Shot Missed %' },
  { key: 'threePointShotMakeShare', display: '3PT Shot Made %' },
  { key: 'threePointShotMissShare', display: '3PT Shot Missed %' },
  { key: 'pointsShare', display: 'Points %' },
  { key: 'assistsShare', display: 'Assists %' },
  { key: 'offensiveReboundsShare', display: 'Offensive Rebounds %' },
  { key: 'defensiveReboundsShare', display: 'Defensive Rebounds %' },
  { key: 'stealsShare', display: 'Steals %' },
  { key: 'blocksShare', display: 'Blocks %' },
  { key: 'turnoversShare', display: 'Turnovers %' },
];
export const TOTAL_PLAYER_STATISTIC_OPTIONS = [
  { key: 'matchCount', display: 'Match Played' },
  { key: 'onePtShotCount', display: '1PT Shot Made' },
  { key: 'onePtShotMissCount', display: '1PT Shot Missed' },
  { key: 'twoPtShotCount', display: '2PT Shot Made' },
  { key: 'twoPtShotMissCount', display: '2PT Shot Missed' },
  { key: 'threePtShotCount', display: '3PT Shot Made' },
  { key: 'threePtShotMissCount', display: '3PT Shot Missed' },
  { key: 'points', display: 'Points' },
  { key: 'assistCount', display: 'Assists' },
  { key: 'offensiveReboundCount', display: 'Offensive Rebounds' },
  { key: 'defensiveReboundCount', display: 'Defensive Rebounds' },
  { key: 'stealCount', display: 'Steals' },
  { key: 'blockCount', display: 'Blocks' },
  { key: 'turnOverCount', display: 'Turnovers' },
  { key: 'onePointShotPercentage', display: '1PT%' },
  { key: 'twoPointShotPercentage', display: '2PT%' },
  { key: 'threePointShotPercentage', display: '3PT%' },
];
