import { BaseResponse } from '../base-response.model';
import { CoachExperienceDetail } from '../staff-experience/coach-experience-detail.model';

export interface CoachDetail extends BaseResponse {
  lastName: string;
  firstName: string;
  dateOfBirth: Date;
  country: string;
  teamId: string | null;
  coachStatus: string;
  specialty: string;
  coachExperiences: CoachExperienceDetail[];
}
