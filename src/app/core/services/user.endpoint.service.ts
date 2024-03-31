import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatchFiltersDto } from '../interfaces/match/match-filters.dto';
import { PagedListConfiguration } from '../interfaces/paged-list/paged-list-configuration.dto';
import { Observable } from 'rxjs';
import { PagedList } from '../interfaces/paged-list/paged-list.model';
import { Match } from '../interfaces/match/match.model';
import { prepareQueryParameters } from '../helpers/query-parameters.helper';
import { UserFiltersDto } from '../interfaces/user/user-filters.dto';
import { User } from '../interfaces/user/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserEndpointService {
  constructor(
    private http: HttpClient,
    @Inject('apiUrl') private baseUrl: string,
  ) {}
  getAllUsers(
    filters: UserFiltersDto,
    pagingSettings: PagedListConfiguration,
  ): Observable<PagedList<User>> {
    let params = prepareQueryParameters(filters, pagingSettings);
    return this.http.get<PagedList<User>>(`${this.baseUrl}/users`, {
      params,
    });
  }

  deleteMatch(userId: string) {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`);
  }
}
