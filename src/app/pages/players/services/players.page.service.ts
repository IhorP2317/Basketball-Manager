import { Injectable } from '@angular/core';
import { PlayerEndpointService } from '../../../core/services/player.endpoint.service';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { PlayerFiltersDto } from '../../../core/interfaces/player/player-filters.dto';
import { PagedListConfiguration } from '../../../core/interfaces/paged-list/paged-list-configuration.dto';
import { PagedList } from '../../../core/interfaces/paged-list/paged-list.model';
import { Player } from '../../../core/interfaces/player/player.model';
import { Team } from '../../../core/interfaces/team/team.model';
import { TeamEndpointService } from '../../../core/services/team.endpoint.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable()
export class PlayersPageService {
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

  public filters$ = this.filtersSubject.asObservable().pipe(debounceTime(300));
  public pagedListSettings$ = this.pagedListSettingsSubject.asObservable();
  public pagedListPlayers$ = this.pagedListPlayersSubject.asObservable();
  public teams$ = this.teamsSubject.asObservable();

  constructor(
    private playerEndpointService: PlayerEndpointService,
    private teamEndpointService: TeamEndpointService,
  ) {
    this.onFiltersAndPagingChange();
    this.loadMatchTeams$().pipe(untilDestroyed(this)).subscribe();
  }

  changeFilters(newFilters: PlayerFiltersDto): void {
    this.filtersSubject.next(newFilters);
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
          this.refreshPlayers();
        }),
        catchError((error) => {
          console.error('Error deleting match:', error);
          return of(null);
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
