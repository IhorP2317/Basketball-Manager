import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoachRequestDto } from '../interfaces/coach/coach-request.dto';
import { Coach } from '../interfaces/coach/coach.model';
import { CoachUpdateDto } from '../interfaces/coach/coach-update.dto';
import { StaffUpdateTeamDto } from '../interfaces/staff/staff-update-team.dto';
import { CoachDetail } from '../interfaces/coach/coach-detail.model';

@Injectable({
  providedIn: 'root',
})
export class CoachEndpointService {
  constructor(
    private http: HttpClient,
    @Inject('apiUrl') private baseUrl: string,
  ) {}

  deleteCoach(coachId: string) {
    return this.http.delete<void>(`${this.baseUrl}/teams/coaches/${coachId}`);
  }

  createCoach(coach: CoachRequestDto) {
    return this.http.post<Coach>(`${this.baseUrl}/teams/coaches/`, coach);
  }

  getCoachDetail(coachId: string) {
    return this.http.get<CoachDetail>(
      `${this.baseUrl}/teams/coaches/${coachId}/details`,
    );
  }

  updateCoach(coachId: string, coach: CoachUpdateDto) {
    return this.http.put<void>(
      `${this.baseUrl}/teams/coaches/${coachId}`,
      coach,
    );
  }

  updateCoachTeam(coachId: string, coach: StaffUpdateTeamDto) {
    return this.http.patch<void>(
      `${this.baseUrl}/teams/coaches/${coachId}/team`,
      coach,
    );
  }

  updateCoachAvatar(coachId: string, file: File) {
    const formData = new FormData();
    console.log(file.name);
    formData.append('picture', file);

    return this.http.patch<void>(
      `${this.baseUrl}/teams/coaches/${coachId}/avatar`,
      formData,
    );
  }
}
