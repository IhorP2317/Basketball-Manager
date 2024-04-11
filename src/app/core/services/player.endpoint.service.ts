import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PagedListConfiguration } from '../interfaces/paged-list/paged-list-configuration.dto';
import { Observable } from 'rxjs';
import { PagedList } from '../interfaces/paged-list/paged-list.model';
import { prepareQueryParameters } from '../helpers/query-parameters.helper';
import { PlayerFiltersDto } from '../interfaces/player/player-filters.dto';
import { Player } from '../interfaces/player/player.model';
import { PlayerRequestDto } from '../interfaces/player/player-request.dto';
import { PlayerUpdateTeamDto } from '../interfaces/player/player-update-team.dto';
import { PlayerUpdateDto } from '../interfaces/player/player-update.dto';

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

  createPlayer(player: PlayerRequestDto) {
    return this.http.post<Player>(`${this.baseUrl}/players/`, player);
  }

  updatePlayer(playerId: string, player: PlayerUpdateDto) {
    return this.http.put<void>(`${this.baseUrl}/players/${playerId}`, player);
  }

  updatePlayerTeam(playerId: string, player: PlayerUpdateTeamDto) {
    return this.http.patch<void>(
      `${this.baseUrl}/players/${playerId}/team`,
      player,
    );
  }

  updatePlayerAvatar(playerId: string, file: File) {
    const formData = new FormData();
    console.log(file.name);
    formData.append('picture', file);

    return this.http.patch<void>(
      `${this.baseUrl}/players/${playerId}/avatar`,
      formData,
    );
  }
}
