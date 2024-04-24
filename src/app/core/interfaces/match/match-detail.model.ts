import { Team } from '../team/team.model';
import { Ticket } from '../ticket/ticket.model';
import { BaseResponse } from '../base-response.model';

export interface MatchDetail extends BaseResponse {
  location: string;
  startTime: string;
  endTime?: string | null;
  homeTeamId: string;
  homeTeam: Team;
  awayTeamId: string;
  awayTeam: Team;
  sectionCount: number;
  rowCount: number;
  seatCount: number;
  homeTeamScore?: number | null;
  awayTeamScore?: number | null;
  status: string;
  tickets: Ticket[];
}
