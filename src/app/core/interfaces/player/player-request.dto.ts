import { PlayerExperienceDto } from '../player-experience/player-experience.dto';

export interface PlayerRequestDto {
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  country: string;
  height: number;
  weight: number;
  teamId: string | null;
  position: string | null;
  jerseyNumber: number;
  playerExperiences: PlayerExperienceDto[] | null;
}
