import { Injectable } from '@angular/core';
import { TeamEndpointService } from '../../../core/services/team.endpoint.service';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { MatchFiltersDto } from '../../../core/interfaces/match/match-filters.dto';
import { PagedListConfiguration } from '../../../core/interfaces/paged-list/paged-list-configuration.dto';
import { PagedList } from '../../../core/interfaces/paged-list/paged-list.model';
import { BaseFiltersDto } from '../../../core/interfaces/base-filters.dto';
import { Team } from '../../../core/interfaces/team/team.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable()
export class TeamsPageService {
  private filtersSubject = new BehaviorSubject<BaseFiltersDto>({
    searchTerm: null,
  });
  private pagedListSettingsSubject =
    new BehaviorSubject<PagedListConfiguration>({
      page: 1,
      pageSize: 10,
    });
  private pagedListTeamsSubject = new BehaviorSubject<PagedList<Team> | null>(
    null,
  );

  public filters$ = this.filtersSubject
    .asObservable()
    .pipe(debounceTime(300), distinctUntilChanged());
  public pagedListSettings$ = this.pagedListSettingsSubject.asObservable();
  public pagedListTeams$ = this.pagedListTeamsSubject.asObservable();

  constructor(private teamEndpointService: TeamEndpointService) {
    this.onFiltersAndPagingChange();
  }

  changeFilters(newFilters: BaseFiltersDto): void {
    this.filtersSubject.next(newFilters);
    const currentPageListSettings = this.pagedListSettingsSubject.value;
    const updatedPageListSettings = { ...currentPageListSettings, page: 1 };
    this.changePagedListSettings(updatedPageListSettings);
  }

  changePagedListSettings(pagedListSettings: PagedListConfiguration): void {
    this.pagedListSettingsSubject.next(pagedListSettings);
  }

  setSearchedTeam(teamName: string | null) {
    const filters = this.filtersSubject.value;
    this.changeFilters({
      ...filters,
      searchTerm: teamName,
    });
  }

  private onFiltersAndPagingChange(): void {
    combineLatest([this.filters$, this.pagedListSettings$])
      .pipe(
        switchMap(([filters, pagedListSettings]) =>
          this.loadTeamsList$(filters, pagedListSettings),
        ),
        untilDestroyed(this),
      )
      .subscribe();
  }

  deleteTeam(teamId: string) {
    this.teamEndpointService
      .deleteTeam(teamId)
      .pipe(
        tap(() => {
          if (
            this.pagedListTeamsSubject.value!.hasPreviousPage &&
            this.pagedListTeamsSubject.value!.items.length === 1
          ) {
            const pageListSettings = this.pagedListSettingsSubject.value;
            pageListSettings.page = pageListSettings.page - 1;
            this.changePagedListSettings(pageListSettings);
          }
          this.refreshTeams();
        }),
        catchError((error) => {
          console.error('Error deleting match:', error);
          return of(null);
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private refreshTeams() {
    const currentFilters = this.filtersSubject.value;
    const currentPagedListSettings = this.pagedListSettingsSubject.value;
    this.loadTeamsList$(currentFilters, currentPagedListSettings)
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  private loadTeamsList$(
    filters: MatchFiltersDto,
    pagedListSettings: PagedListConfiguration,
  ) {
    return this.teamEndpointService
      .getAllFilteredAndPagedTeams(filters, pagedListSettings)
      .pipe(
        tap((matches) => {
          this.pagedListTeamsSubject.next(matches);
        }),
      );
  }
}
