import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PagedListConfiguration } from '../interfaces/paged-list/paged-list-configuration.dto';
import { Observable } from 'rxjs';
import { PagedList } from '../interfaces/paged-list/paged-list.model';
import { prepareQueryParameters } from '../helpers/query-parameters.helper';
import { PlayerFiltersDto } from '../interfaces/player/player-filters.dto';
import { Player } from '../interfaces/player/player.model';

@Injectable({
  providedIn: 'root',
})
export class PlayerEndpointService {
  constructor(
    private http: HttpClient,
    @Inject('apiUrl') private baseUrl: string,
  ) {}
  getAllPlayers(
    filters: PlayerFiltersDto,
    pagingSettings: PagedListConfiguration,
  ): Observable<PagedList<Player>> {
    let params = prepareQueryParameters(filters, pagingSettings);
    return this.http.get<PagedList<Player>>(`${this.baseUrl}/players`, {
      params,
    });
  }
  deletePlayer(playerId: string) {
    return this.http.delete<void>(`${this.baseUrl}/players/${playerId}`);
  }
}
