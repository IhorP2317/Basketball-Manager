export interface matchDto {
  location:string;
  startDate:Date;
  endDate?:Date|null;
  homeTeamId: string;
  awayTeamId: string;
  sectionCount: number;
  rowCount: number;
  seatCount: number;
  status: string;
}
