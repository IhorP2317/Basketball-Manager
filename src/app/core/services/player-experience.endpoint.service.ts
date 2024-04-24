import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatchExperienceFiltersDto } from '../interfaces/staff-experience/match-experience-filters.dto';
import { prepareQueryParameters } from '../helpers/query-parameters.helper';
import { PlayerExperienceDetail } from '../interfaces/staff-experience/player-experience-detail.model';
import { StaffExperienceDto } from '../interfaces/staff-experience/staff-experience.dto';
import { StaffExperienceUpdateDto } from '../interfaces/staff-experience/staff-experience-update.dto';

@Injectable({
  providedIn: 'root',
})
export class PlayerExperienceEndpointService {
  constructor(
    private http: HttpClient,
    @Inject('apiUrl') private baseUrl: string,
  ) {}

  getAllPlayerExperiencesInMatch(
    matchExperienceFiltersDto: MatchExperienceFiltersDto,
  ) {
    let params = prepareQueryParameters(matchExperienceFiltersDto);
    return this.http.get<PlayerExperienceDetail[]>(
      `${this.baseUrl}/players/experiences/filters`,
      { params },
    );
  }

  createPlayerExperience(
    playerId: string,
    playerExperienceDto: StaffExperienceDto,
  ) {
    return this.http.post<StaffExperienceDto>(
      `${this.baseUrl}/players/${playerId}/experiences`,
      playerExperienceDto,
    );
  }

  updatePlayerExperience(
    playerExperienceId: string,
    playerExperienceUpdateDto: StaffExperienceUpdateDto,
  ) {
    return this.http.patch<void>(
      `${this.baseUrl}/players/experiences/${playerExperienceId}`,
      playerExperienceUpdateDto,
    );
  }

  deletePlayerExperience(playerExperienceId: string) {
    return this.http.delete<void>(
      `${this.baseUrl}/players/experiences/${playerExperienceId}`,
    );
  }
}
