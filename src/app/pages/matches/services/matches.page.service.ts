import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { PagedListConfiguration } from '../../../core/interfaces/paged-list/paged-list-configuration.dto';
import { MatchFiltersDto } from '../../../core/interfaces/match/match-filters.dto';
import moment from 'moment/moment';
import { PagedList } from '../../../core/interfaces/paged-list/paged-list.model';
import { Match } from '../../../core/interfaces/match/match.model';
import { MatchEndpointService } from '../../../core/services/match.endpoint.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TeamEndpointService } from '../../../core/services/team.endpoint.service';
import { Team } from '../../../core/interfaces/team/team.model';

@UntilDestroy()
@Injectable()
export class MatchesPageService {
  private filtersSubject = new BehaviorSubject<MatchFiltersDto>({
    year: moment().year(),
    month: moment().month(),
  });
  private pagedListSettingsSubject =
    new BehaviorSubject<PagedListConfiguration>({
      page: 1,
      pageSize: 5,
    });
  private pagedListMatchesSubject =
    new BehaviorSubject<PagedList<Match> | null>(null);
  private yearsFiltersSubject = new BehaviorSubject<number[]>([
    moment().year(),
  ]);
  private teamsSubject = new BehaviorSubject<Team[] | null>(null);

  public filters$ = this.filtersSubject
    .asObservable()
    .pipe(distinctUntilChanged());
  public pagedListSettings$ = this.pagedListSettingsSubject.asObservable();
  public pagedListMatches$ = this.pagedListMatchesSubject.asObservable();
  public yearsFilters$ = this.yearsFiltersSubject.asObservable();
  public teams$ = this.teamsSubject.asObservable();

  constructor(
    private matchEndpointService: MatchEndpointService,
    private teamEndpointService: TeamEndpointService,
  ) {
    this.onFiltersAndPagingChange();
    this.loadMatchYears$().pipe(untilDestroyed(this)).subscribe();
    this.loadMatchTeams$().pipe(untilDestroyed(this)).subscribe();
  }

  changeFilters(newFilters: MatchFiltersDto): void {
    this.filtersSubject.next(newFilters);
  }

  setPreviousMonth() {
    const filters = this.filtersSubject.value;
    const currentDate = moment([filters.year!, filters.month!, 1]);
    currentDate.subtract(1, 'month');

    this.changeFilters({
      ...filters,
      year: currentDate.year(),
      month: currentDate.month(),
    });
  }

  setSelectedYear(year: number) {
    const filters = this.filtersSubject.value;

    this.changeFilters({
      ...filters,
      year: year,
    });
  }

  setSelectedTeam(team: string | null) {
    const filters = this.filtersSubject.value;

    this.changeFilters({
      ...filters,
      teamName: team,
    });
  }

  setNextMonth() {
    const filters = this.filtersSubject.value;
    const currentDate = moment([filters.year!, filters.month!, 1]);
    currentDate.add(1, 'month');

    this.changeFilters({
      ...filters,
      year: currentDate.year(),
      month: currentDate.month(),
    });
  }

  changePagedListSettings(pagedListSettings: PagedListConfiguration): void {
    this.pagedListSettingsSubject.next(pagedListSettings);
  }

  private onFiltersAndPagingChange(): void {
    combineLatest([this.filters$, this.pagedListSettings$])
      .pipe(
        switchMap(([filters, pagedListSettings]) =>
          this.loadMatchesList$(filters, pagedListSettings),
        ),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private loadMatchesList$(
    filters: MatchFiltersDto,
    pagedListSettings: PagedListConfiguration,
  ) {
    return this.matchEndpointService
      .getAllMatches(filters, pagedListSettings)
      .pipe(
        tap((matches) => {
          this.pagedListMatchesSubject.next(matches);
        }),
      );
  }

  deleteMatch(matchId: string) {
    this.matchEndpointService
      .deleteMatch(matchId)
      .pipe(
        tap(() => {
          this.refreshMatches();
        }),
        catchError((error) => {
          console.error('Error deleting match:', error);
          return of(null);
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private refreshMatches() {
    const currentFilters = this.filtersSubject.value;
    const currentPagedListSettings = this.pagedListSettingsSubject.value;
    this.loadMatchesList$(currentFilters, currentPagedListSettings)
      .pipe(untilDestroyed(this))
      .subscribe();
    this.loadMatchYears$().pipe(untilDestroyed(this)).subscribe();
  }

  private loadMatchYears$() {
    return this.matchEndpointService.getAllMatchYears().pipe(
      tap((years) => {
        this.yearsFiltersSubject.next(years);
      }),
    );
  }

  private loadMatchTeams$() {
    return this.teamEndpointService.getAllTeams().pipe(
      tap((teams) => {
        this.teamsSubject.next(teams);
      }),
    );
  }
}
