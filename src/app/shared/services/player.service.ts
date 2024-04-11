import { Injectable } from '@angular/core';
import { PlayerEndpointService } from '../../core/services/player.endpoint.service';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { PlayerFiltersDto } from '../../core/interfaces/player/player-filters.dto';
import { PagedListConfiguration } from '../../core/interfaces/paged-list/paged-list-configuration.dto';
import { PagedList } from '../../core/interfaces/paged-list/paged-list.model';
import { Player } from '../../core/interfaces/player/player.model';
import { Team } from '../../core/interfaces/team/team.model';
import { TeamEndpointService } from '../../core/services/team.endpoint.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PlayerRequestDto } from '../../core/interfaces/player/player-request.dto';
import { AlertService } from './alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../../core/interfaces/errors/api-error';
import { PlayerUpdateDto } from '../../core/interfaces/player/player-update.dto';
import { PlayerUpdateTeamDto } from '../../core/interfaces/player/player-update-team.dto';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private filtersSubject = new BehaviorSubject<PlayerFiltersDto>({
    searchTerm: null,
    sortColumn: null,
    teamName: null,
    country: null,
    position: null,
  });
  private pagedListSettingsSubject =
    new BehaviorSubject<PagedListConfiguration>({
      page: 1,
      pageSize: 5,
    });
  private pagedListPlayersSubject =
    new BehaviorSubject<PagedList<Player> | null>(null);
  private teamsSubject = new BehaviorSubject<Team[] | null>(null);

  public filters$ = this.filtersSubject.asObservable();
  public pagedListSettings$ = this.pagedListSettingsSubject.asObservable();
  public pagedListPlayers$ = this.pagedListPlayersSubject.asObservable();
  public teams$ = this.teamsSubject.asObservable();

  constructor(
    private playerEndpointService: PlayerEndpointService,
    private teamEndpointService: TeamEndpointService,
    private alertService: AlertService,
  ) {
    this.onFiltersAndPagingChange();
    this.loadMatchTeams$().pipe(untilDestroyed(this)).subscribe();
  }

  changeFilters(newFilters: PlayerFiltersDto): void {
    this.filtersSubject.next(newFilters);
    const currentPageListSettings = this.pagedListSettingsSubject.value;
    const updatedPageListSettings = { ...currentPageListSettings, page: 1 };
    this.changePagedListSettings(updatedPageListSettings);
  }

  changePagedListSettings(pagedListSettings: PagedListConfiguration): void {
    this.pagedListSettingsSubject.next(pagedListSettings);
  }

  setSelectedTeam(team: string | null) {
    const filters = this.filtersSubject.value;

    this.changeFilters({
      ...filters,
      teamName: team,
    });
  }

  setSelectedCountry(country: string | null) {
    const filters = this.filtersSubject.value;

    this.changeFilters({
      ...filters,
      country: country,
    });
  }

  setSelectedPosition(position: string | null) {
    const filters = this.filtersSubject.value;

    this.changeFilters({
      ...filters,
      position: position,
    });
  }

  private onFiltersAndPagingChange(): void {
    combineLatest([this.filters$, this.pagedListSettings$])
      .pipe(
        switchMap(([filters, pagedListSettings]) =>
          this.loadPlayersList$(filters, pagedListSettings),
        ),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private loadPlayersList$(
    filters: PlayerFiltersDto,
    pagedListSettings: PagedListConfiguration,
  ) {
    return this.playerEndpointService
      .getAllPlayers(filters, pagedListSettings)
      .pipe(
        tap((matches) => {
          this.pagedListPlayersSubject.next(matches);
        }),
      );
  }

  setSearchedPlayer(fullName: string | null) {
    const filters = this.filtersSubject.value;
    this.changeFilters({
      ...filters,
      searchTerm: fullName,
    });
  }

  changeSortingSettings(sortColumn: string | null, sortOrder: boolean) {
    const filters = this.filtersSubject.value;

    this.changeFilters({
      ...filters,
      sortColumn: sortColumn,
      sortOrder: sortOrder ? 'desc' : 'asc',
    });
  }

  deletePlayer(playerId: string) {
    this.playerEndpointService
      .deletePlayer(playerId)
      .pipe(
        tap(() => {
          if (
            this.pagedListPlayersSubject.value!.hasPreviousPage &&
            this.pagedListPlayersSubject.value!.items.length === 1
          ) {
            this.changePagedListSettings({
              ...this.pagedListSettingsSubject.value,
              page: this.pagedListSettingsSubject.value.page - 1,
            });
          }
          this.refreshPlayers();
        }),
        catchError((error) => {
          this.alertService.error('Error deleting player: ', error.detail);
          return throwError(error);
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }

  createPlayer(player: PlayerRequestDto, playerImage?: File) {
    this.playerEndpointService
      .createPlayer(player)
      .pipe(
        switchMap((player) =>
          playerImage
            ? this.playerEndpointService.updatePlayerAvatar(
                player.id,
                playerImage,
              )
            : of([]),
        ),
        tap(() => {
          this.refreshPlayers();
        }),
        catchError((response: HttpErrorResponse) => {
          const apiError = response.error as ApiError;
          let errorMessage = apiError.detail || 'An unknown error occurred';
          if (apiError.errors) {
            const errorMessages = Object.entries(apiError.errors)
              .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
              .join('; ');
            errorMessage += `: ${errorMessages}`;
          }

          this.alertService.error(`Error creating player: ${errorMessage}`);

          return throwError(() => new Error(errorMessage));
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }

  updatePlayer(playerId: string, player: PlayerRequestDto, playerImage?: File) {
    const playerUpdateDto: PlayerUpdateDto = {
      ...player,
    };
    const playerUpdateTeamDto: PlayerUpdateTeamDto = {
      newTeamId: player.teamId,
    };

    this.playerEndpointService
      .updatePlayer(playerId, playerUpdateDto)
      .pipe(
        switchMap(() =>
          this.playerEndpointService.updatePlayerTeam(
            playerId,
            playerUpdateTeamDto,
          ),
        ),
        switchMap(() =>
          playerImage
            ? this.playerEndpointService.updatePlayerAvatar(
                playerId,
                playerImage,
              )
            : of([]),
        ),

        tap(() => this.refreshPlayers()),

        catchError((response: HttpErrorResponse) => {
          const apiError = response.error as ApiError;
          let errorMessage = apiError.detail || 'An unknown error occurred';
          if (apiError.errors) {
            const errorMessages = Object.entries(apiError.errors)
              .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
              .join('; ');
            errorMessage += `: ${errorMessages}`;
          }
          this.alertService.error(`Error updating player: ${errorMessage}`);
          return throwError(() => new Error(errorMessage));
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private refreshPlayers() {
    const currentFilters = this.filtersSubject.value;
    const currentPagedListSettings = this.pagedListSettingsSubject.value;
    this.loadPlayersList$(currentFilters, currentPagedListSettings)
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  private loadMatchTeams$() {
    return this.teamEndpointService.getAllTeams().pipe(
      tap((teams) => {
        this.teamsSubject.next(teams);
      }),
    );
  }
}
