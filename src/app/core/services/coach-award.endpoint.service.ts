import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AwardRequestDto } from '../interfaces/awards/award-request.dto';
import { Award } from '../interfaces/awards/award.model';

@Injectable({
  providedIn: 'root',
})
export class CoachAwardEndpointService {
  constructor(
    private http: HttpClient,
    @Inject('apiUrl') private baseUrl: string,
  ) {}

  createCoachAward(
    coachExperienceId: string,
    awardRequestDto: AwardRequestDto,
  ) {
    return this.http.post<Award>(
      `${this.baseUrl}/coaches/experiences/${coachExperienceId}/awards`,
      awardRequestDto,
    );
  }

  deleteCoachAward(coachExperienceId: string, awardId: string) {
    return this.http.delete<void>(
      `${this.baseUrl}/coaches/experiences/${coachExperienceId}/awards/${awardId}`,
    );
  }
}
