import { BaseResponse } from '../base-response.model';

export interface PlayerExperience extends BaseResponse {
  playerId: string;
  teamId: string;
  startDate: Date;
  endDate: Date | null;
}
