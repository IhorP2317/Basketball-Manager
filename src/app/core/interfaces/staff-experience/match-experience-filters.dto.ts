export interface MatchExperienceFiltersDto {
  homeTeamId: string | null;
  awayTeamId: string | null;
  matchStartTime: string | null;

  [key: string]: string | number | boolean | undefined | null;
}
