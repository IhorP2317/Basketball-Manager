import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AwardRequestDto } from '../interfaces/awards/award-request.dto';
import { Award } from '../interfaces/awards/award.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerAwardEndpointService {
  constructor(
    private http: HttpClient,
    @Inject('apiUrl') private baseUrl: string,
  ) {}

  createPlayerAward(
    playerExperienceId: string,
    awardRequestDto: AwardRequestDto,
  ) {
    return this.http.post<Award>(
      `${this.baseUrl}/players/experiences/${playerExperienceId}/awards`,
      awardRequestDto,
    );
  }

  deleteCoachAward(playerExperienceId: string, awardId: string) {
    return this.http.delete<void>(
      `${this.baseUrl}/players/experiences/${playerExperienceId}/awards/${awardId}`,
    );
  }
}
