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
export const EMAIL_STATUSES = [
  { value: 'All statuses' },
  { value: 'Confirmed' },
  { value: 'Unconfirmed' },
];
export const DEFAULT_COUNTRY: Country = {
  name: 'Ukraine',
  alpha2Code: 'UA',
  alpha3Code: 'UKR',
  numericCode: '804',
  callingCode: '+380',
};
