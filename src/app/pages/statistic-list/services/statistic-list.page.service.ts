import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  EMPTY,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Statistic } from '../../../core/interfaces/statistic/statistic.model';
import { StatisticFiltersDto } from '../../../core/interfaces/statistic/statistic-filters.dto';
import { StatisticEndpointService } from '../../../core/services/statistic.endpoint.service';
import { AlertService } from '../../../shared/services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandler } from '../../../core/helpers/api-error-handler.helper';
import { MatchEndpointService } from '../../../core/services/match.endpoint.service';
import { Router } from '@angular/router';
import { PagedListConfiguration } from '../../../core/interfaces/paged-list/paged-list-configuration.dto';
import { PagedList } from '../../../core/interfaces/paged-list/paged-list.model';
import { StatisticDto } from '../../../core/interfaces/statistic/statistic.dto';
import { MatchExperienceFiltersDto } from '../../../core/interfaces/staff-experience/match-experience-filters.dto';
import { PlayerExperienceEndpointService } from '../../../core/services/player-experience.endpoint.service';

@UntilDestroy()
@Injectable()
export class StatisticListPageService {
  private matchStatisticsPagedListSubject =
    new BehaviorSubject<PagedList<Statistic> | null>(null);
  private currentMatchIdSubject = new BehaviorSubject<string | null>(null);
  private statisticFiltersSubject = new BehaviorSubject<StatisticFiltersDto>({
    timeUnit: 1,
    teamId: null,
  });
  private statisticPageSettingsSubject =
    new BehaviorSubject<PagedListConfiguration>({
      page: 1,
      pageSize: 5,
    });
  public matchStatistics$ = this.matchStatisticsPagedListSubject.asObservable();
  public currentMatchId$ = this.currentMatchIdSubject.asObservable();
  public statisticFilters$ = this.statisticFiltersSubject.asObservable();
  public statisticPageSettings$ =
    this.statisticPageSettingsSubject.asObservable();

  constructor(
    private statisticEndpointService: StatisticEndpointService,
    private matchEndpointService: MatchEndpointService,
    private playerExperienceEndpointService: PlayerExperienceEndpointService,
    private alertService: AlertService,
    private router: Router,
  ) {
    combineLatest([
      this.statisticFilters$,
      this.currentMatchId$,
      this.statisticPageSettings$,
      this.statisticPageSettings$,
    ])
      .pipe(
        switchMap(([filters, matchId, pagingSettings]) => {
          return matchId
            ? this.loadStatistic$(matchId, filters, pagingSettings)
            : of(null);
        }),
        catchError((response: HttpErrorResponse) =>
          ApiErrorHandler.handleError(response, this.alertService),
        ),
        untilDestroyed(this),
      )
      .subscribe();
  }

  changeFilters(newFilters: StatisticFiltersDto): void {
    this.statisticFiltersSubject.next(newFilters);
    this.changePagingSettings({
      ...this.statisticPageSettingsSubject.value,
      page: 1,
    });
  }

  changePagingSettings(newSettings: PagedListConfiguration) {
    this.statisticPageSettingsSubject.next(newSettings);
  }

  loadStatistic$(
    matchId: string,
    statisticFilters: StatisticFiltersDto,
    pagingSettings: PagedListConfiguration,
  ) {
    return this.statisticEndpointService
      .getAllStatisticsByMatch(matchId, statisticFilters, pagingSettings)
      .pipe(
        tap((statistics) =>
          this.matchStatisticsPagedListSubject.next(statistics),
        ),
      );
  }

  loadMatch$(matchId: string) {
    return this.matchEndpointService.getMatchDetail(matchId).pipe(
      catchError((response: HttpErrorResponse) => {
        if (response.status === 404) {
          this.router.navigateByUrl('/not-found');
          return EMPTY;
        }
        return (
          ApiErrorHandler.handleError(response, this.alertService) || EMPTY
        );
      }),
    );
  }

  deleteStatistic(
    matchId: string,
    playerExperienceId: string,
    timeUnit: number,
  ) {
    this.statisticEndpointService
      .deleteStatistic(matchId, playerExperienceId, timeUnit)
      .pipe(
        tap(() => {
          if (
            this.matchStatisticsPagedListSubject.value!.hasPreviousPage &&
            this.matchStatisticsPagedListSubject.value!.items.length === 1
          ) {
            const pageListSettings = this.statisticPageSettingsSubject.value;
            pageListSettings.page = pageListSettings.page - 1;
            this.changePagingSettings(pageListSettings);
          }
          this.refreshStatistics();
        }),
        catchError((response: HttpErrorResponse) =>
          ApiErrorHandler.handleError(response, this.alertService),
        ),
        untilDestroyed(this),
      )
      .subscribe();
  }

  createStatistic(statistic: StatisticDto) {
    this.statisticEndpointService
      .createStatistic(statistic)
      .pipe(
        tap(() => this.refreshStatistics()),
        catchError((response: HttpErrorResponse) =>
          ApiErrorHandler.handleError(response, this.alertService),
        ),
        untilDestroyed(this),
      )
      .subscribe();
  }

  updateStatistic(statistic: StatisticDto) {
    this.statisticEndpointService
      .updateStatistic(statistic)
      .pipe(
        tap(() => this.refreshStatistics()),
        catchError((response: HttpErrorResponse) =>
          ApiErrorHandler.handleError(response, this.alertService),
        ),
        untilDestroyed(this),
      )
      .subscribe();
  }

  setCurrentMatchId(matchId: string): void {
    this.currentMatchIdSubject.next(matchId);
  }

  getAllPlayerExperiencesInMatch$(
    matchPlayerExperienceFilters: MatchExperienceFiltersDto,
  ) {
    return this.playerExperienceEndpointService
      .getAllPlayerExperiencesInMatch(matchPlayerExperienceFilters)
      .pipe(
        catchError((response: HttpErrorResponse) =>
          ApiErrorHandler.handleError(response, this.alertService),
        ),
      );
  }

  private refreshStatistics() {
    this.loadStatistic$(
      this.currentMatchIdSubject.value!,
      this.statisticFiltersSubject.value,
      this.statisticPageSettingsSubject.value,
    )
      .pipe(untilDestroyed(this))
      .subscribe();
  }
}
