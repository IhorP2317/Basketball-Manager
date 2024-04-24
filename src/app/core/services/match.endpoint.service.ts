import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatchFiltersDto } from '../interfaces/match/match-filters.dto';
import { Observable } from 'rxjs';
import { PagedList } from '../interfaces/paged-list/paged-list.model';
import { Match } from '../interfaces/match/match.model';
import { PagedListConfiguration } from '../interfaces/paged-list/paged-list-configuration.dto';
import {
  prepareMatchStatisticQueryParameters,
  prepareQueryFiltersAndPagingSettings,
} from '../helpers/query-parameters.helper';
import { MatchRequestDto } from '../interfaces/match/match-request.dto';
import { MatchUpdateDto } from '../interfaces/match/match-update.dto';
import { MatchStatisticFiltersDto } from '../interfaces/statistic/match-statistic-filters.dto';
import { PlayerStatistic } from '../interfaces/statistic/player-statistic.model';
import { MatchDetail } from '../interfaces/match/match-detail.model';
import { MatchTeamStatistic } from '../interfaces/statistic/match-team-statistic.model';
import { PlayerImpactStatisticModel } from '../interfaces/statistic/player-impact-statistic.model';
import { TotalTeamStatisticModel } from '../interfaces/statistic/total-team-statistic.model';

@Injectable({
  providedIn: 'root',
})
export class MatchEndpointService {
  constructor(
    private http: HttpClient,
    @Inject('apiUrl') private baseUrl: string,
  ) {}

  getAllMatches(
    filters: MatchFiltersDto,
    pagingSettings: PagedListConfiguration,
  ): Observable<PagedList<Match>> {
    let params = prepareQueryFiltersAndPagingSettings(filters, pagingSettings);
    return this.http.get<PagedList<Match>>(`${this.baseUrl}/matches`, {
      params,
    });
  }

  getAllMatchYears(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/matches/filters/years`);
  }

  deleteMatch(matchId: string) {
    return this.http.delete<void>(`${this.baseUrl}/matches/${matchId}`);
  }

  updateMatch(matchId: string, match: MatchUpdateDto) {
    return this.http.put<void>(`${this.baseUrl}/matches/${matchId}`, match);
  }

  getMatchDetail(matchId: string) {
    return this.http.get<MatchDetail>(
      `${this.baseUrl}/matches/${matchId}/details`,
    );
  }

  createMatch(match: MatchRequestDto) {
    return this.http.post<Match>(`${this.baseUrl}/matches`, match);
  }

  getAllPlayersStatisticByMatch(
    matchId: string,
    matchStatisticFiltersDto: MatchStatisticFiltersDto,
  ) {
    let params = prepareMatchStatisticQueryParameters(matchStatisticFiltersDto);
    return this.http.get<PlayerStatistic[]>(
      `${this.baseUrl}/matches/${matchId}/players-statistics`,
      {
        params,
      },
    );
  }

  getAllTeamsStatisticByMatch(
    matchId: string,
    matchStatisticFiltersDto: MatchStatisticFiltersDto,
  ) {
    let params = prepareMatchStatisticQueryParameters(matchStatisticFiltersDto);
    return this.http.get<MatchTeamStatistic[]>(
      `${this.baseUrl}/matches/${matchId}/teams-statistics`,
      {
        params,
      },
    );
  }

  getAllTotalTeamsStatisticByMatch(
    matchId: string,
    matchStatisticFiltersDto: MatchStatisticFiltersDto,
  ) {
    let params = prepareMatchStatisticQueryParameters(matchStatisticFiltersDto);
    return this.http.get<TotalTeamStatisticModel[]>(
      `${this.baseUrl}/matches/${matchId}/total-teams-statistics`,
      {
        params,
      },
    );
  }

  getPlayersImpactInMatch(
    matchId: string,
    matchStatisticFiltersDto: MatchStatisticFiltersDto,
  ) {
    let params = prepareMatchStatisticQueryParameters(matchStatisticFiltersDto);
    return this.http.get<PlayerImpactStatisticModel[]>(
      `${this.baseUrl}/matches/${matchId}/players/impacts`,
      {
        params,
      },
    );
  }
}
