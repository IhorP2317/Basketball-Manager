import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatchFiltersDto } from '../interfaces/match/match-filters.dto';
import { Observable } from 'rxjs';
import { PagedList } from '../interfaces/paged-list/paged-list.model';
import { Match } from '../interfaces/match/match.model';
import { PagedListConfiguration } from '../interfaces/paged-list/paged-list-configuration.dto';
import { prepareQueryParameters } from '../helpers/query-parameters.helper';

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
    let params = prepareQueryParameters(filters, pagingSettings);
    return this.http.get<PagedList<Match>>(`${this.baseUrl}/matches`, {
      params,
    });
  }
  getAllMatchYears(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/matches/filters/years`);
  }
  deleteMatch(matchId: string) {
    console.log(matchId);
    return this.http.delete<void>(`${this.baseUrl}/matches/${matchId}`);
  }
}
