import { BaseResponse } from '../base-response.model';
import { PlayerExperienceDetail } from '../staff-experience/player-experience-detail.model';

export interface PlayerDetail extends BaseResponse {
  lastName: string;
  firstName: string;
  dateOfBirth: Date;
  country: string;
  height: number;
  weight: number;
  position: string;
  jerseyNumber: number;
  teamId: string | null;
  playerExperiences: PlayerExperienceDetail[];
}
