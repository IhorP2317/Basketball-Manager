import { BaseResponse } from '../base-response.model';

export interface Coach extends BaseResponse {
  lastName: string;
  firstName: string;
  dateOfBirth: Date;
  country: string;
  teamId: string | null;
  coachStatus: string;
  specialty: string;
}
