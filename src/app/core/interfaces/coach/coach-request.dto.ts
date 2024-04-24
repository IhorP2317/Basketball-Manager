import { CoachExperienceDto } from '../staff-experience/coach-experience.dto';

export interface CoachRequestDto {
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  country: string;
  teamId: string | null;
  coachStatus: string;
  specialty: string;
  coachExperiences: CoachExperienceDto[] | null;
}
