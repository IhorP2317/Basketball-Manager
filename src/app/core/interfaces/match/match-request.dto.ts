export interface MatchRequestDto {
  location: string;
  startTime: string;
  endTime: string | null;
  homeTeamId: string;
  awayTeamId: string;
  sectionCount: number;
  rowCount: number;
  seatCount: number;
  status: string;
}
