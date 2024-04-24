import { BaseResponse } from '../base-response.model';
import { Award } from '../awards/award.model';

export interface PlayerExperienceDetail extends BaseResponse {
  playerId: string;
  teamId: string;
  startDate: Date;
  endDate: Date | null;
  fullName: string;
  teamName: string;
  playerAwards: Award[];
}
