export interface MatchUpdateDto {
  location: string;
  startTime: string;
  endTime: string | null;
  sectionCount: number;
  rowCount: number;
  seatCount: number;
  status: string;
}
