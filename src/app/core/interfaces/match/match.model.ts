import {BaseResponse} from "../base-response.model";

export interface Match extends  BaseResponse{
   location:string;
   startTime:string;
  endTime?:string|null;
  homeTeamId: string;
  homeTeamLogoUrl: string | null;
  homeTeamName: string;
  awayTeamId: string;
  awayTeamName: string;
  awayTeamLogoUrl: string | null;
  sectionCount: number;
  rowCount: number;
  seatCount: number;
  homeTeamScore?:number|null;
  awayTeamScore?:number|null;
  status: string;

}

