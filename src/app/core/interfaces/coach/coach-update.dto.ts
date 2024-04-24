export interface CoachUpdateDto {
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  country: string;
  teamId: string | null;
  coachStatus: string;
  specialty: string;
}
