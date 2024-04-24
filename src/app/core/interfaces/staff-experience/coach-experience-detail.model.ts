import { BaseResponse } from '../base-response.model';
import { Award } from '../awards/award.model';

export interface CoachExperienceDetail extends BaseResponse {
  coachId: string;
  teamId: string;
  fullName: string;
  teamName: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
  coachAwards: Award[];
}
