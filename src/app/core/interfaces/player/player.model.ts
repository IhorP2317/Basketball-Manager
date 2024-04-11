import { BaseResponse } from '../base-response.model';

export interface Player extends BaseResponse {
  lastName: string;
  firstName: string;
  dateOfBirth: Date;
  country: string;
  height: number;
  weight: number;
  position: string;
  jerseyNumber: number;
  teamName: string;
  teamId?: string | null;
  photoPath?: string | null;
}
