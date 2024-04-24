import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PagedListConfiguration } from '../interfaces/paged-list/paged-list-configuration.dto';
import { Observable } from 'rxjs';
import { PagedList } from '../interfaces/paged-list/paged-list.model';
import { prepareQueryFiltersAndPagingSettings } from '../helpers/query-parameters.helper';
import { BaseFiltersDto } from '../interfaces/base-filters.dto';
import { Team } from '../interfaces/team/team.model';
import { TeamDetail } from '../interfaces/team/team-detail.model';
import { TeamDto } from '../interfaces/team/team.dto';

@Injectable({
  providedIn: 'root',
})
export class TeamEndpointService {
  constructor(
    private http: HttpClient,
    @Inject('apiUrl') private baseUrl: string,
  ) {}

  getAllFilteredAndPagedTeams(
    filters: BaseFiltersDto,
    pagingSettings: PagedListConfiguration,
  ): Observable<PagedList<Team>> {
    let params = prepareQueryFiltersAndPagingSettings(filters, pagingSettings);
    return this.http.get<PagedList<Team>>(`${this.baseUrl}/teams/filters`, {
      params,
    });
  }

  getAllTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.baseUrl}/teams`);
  }

  getTeamDetail(teamId: string): Observable<TeamDetail> {
    return this.http.get<TeamDetail>(`${this.baseUrl}/teams/${teamId}/detail`);
  }

  createTeam(team: TeamDto) {
    return this.http.post<Team>(`${this.baseUrl}/teams`, team);
  }

  updateTeam(teamId: string, team: TeamDto) {
    return this.http.put<void>(`${this.baseUrl}/teams/${teamId}`, team);
  }

  updateTeamAvatar(teamId: string, file: File) {
    const formData = new FormData();
    formData.append('picture', file);

    return this.http.patch<void>(
      `${this.baseUrl}/teams/${teamId}/avatar`,
      formData,
    );
  }

  deleteTeam(teamId: string) {
    return this.http.delete<void>(`${this.baseUrl}/teams/${teamId}`);
  }
}
