import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoachExperienceDto } from '../interfaces/staff-experience/coach-experience.dto';
import { StaffExperienceUpdateDto } from '../interfaces/staff-experience/staff-experience-update.dto';
import { CoachExperienceDetail } from '../interfaces/staff-experience/coach-experience-detail.model';

@Injectable({
  providedIn: 'root',
})
export class CoachExperienceEndpointService {
  constructor(
    private http: HttpClient,
    @Inject('apiUrl') private baseUrl: string,
  ) {}

  getAllCoachExperienceDetailByCoach(coachId: string) {
    return this.http.get<CoachExperienceDetail>(
      `${this.baseUrl}/teams/coaches/${coachId}/experiences/details`,
    );
  }

  createCoachExperience(
    coachId: string,
    coachExperienceDto: CoachExperienceDto,
  ) {
    return this.http.post<CoachExperienceDto>(
      `${this.baseUrl}/teams/coaches/${coachId}/experiences`,
      coachExperienceDto,
    );
  }

  updateCoachExperience(
    coachExperienceId: string,
    coachExperienceUpdateDto: StaffExperienceUpdateDto,
  ) {
    return this.http.patch<void>(
      `${this.baseUrl}/teams/coaches/experiences/${coachExperienceId}`,
      coachExperienceUpdateDto,
    );
  }

  deleteCoachExperience(coachExperienceId: string) {
    return this.http.delete<void>(
      `${this.baseUrl}/teams/coaches/experiences/${coachExperienceId}`,
    );
  }
}
