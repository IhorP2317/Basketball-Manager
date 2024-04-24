import { StaffExperienceDto } from './staff-experience.dto';

export interface CoachExperienceDto extends StaffExperienceDto {
  status: string;
}
