import { Injectable } from '@angular/core';
import { MatchEndpointService } from '../../../core/services/match.endpoint.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  EMPTY,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandler } from '../../../core/helpers/api-error-handler.helper';
import { MatchStatisticFiltersDto } from '../../../core/interfaces/statistic/match-statistic-filters.dto';
import { MatchTeamStatistic } from '../../../core/interfaces/statistic/match-team-statistic.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PlayerImpactStatisticModel } from '../../../core/interfaces/statistic/player-impact-statistic.model';
import { TotalTeamStatisticModel } from '../../../core/interfaces/statistic/total-team-statistic.model';

@UntilDestroy()
@Injectable()
export class MatchStatisticPageService {
  private matchStatisticFiltersSubject =
    new BehaviorSubject<MatchStatisticFiltersDto>({
      isAccumulativeDisplayEnabled: true,
      timeUnit: 1,
      teamId: null,
    });
  private matchTeamStatisticSubject = new BehaviorSubject<
    MatchTeamStatistic[] | null
  >(null);
  private currentMatchIdSubject = new BehaviorSubject<string | null>(null);
  private matchPlayerImpactStatisticSubject = new BehaviorSubject<
    PlayerImpactStatisticModel[] | null
  >(null);
  private totalTeamStatisticSubject = new BehaviorSubject<
    TotalTeamStatisticModel[] | null
  >(null);
  matchStatisticFilters$ = this.matchStatisticFiltersSubject.asObservable();
  matchTeamStatistic$ = this.matchTeamStatisticSubject.asObservable();
  currentMatchId$ = this.currentMatchIdSubject.asObservable();
  matchPlayerImpactStatistic$ =
    this.matchPlayerImpactStatisticSubject.asObservable();
  totalTeamStatistic$ = this.totalTeamStatisticSubject.asObservable();

  constructor(
    private matchEndpointService: MatchEndpointService,
    private router: Router,
    private alertService: AlertService,
  ) {
    combineLatest([this.matchStatisticFilters$, this.currentMatchId$])
      .pipe(
        switchMap(([filters, matchId]) => {
          if (!matchId) return of(null);
          return this.loadTeamStatistic$(matchId, filters).pipe(
            switchMap((teamStatistic) => {
              if (!filters.teamId)
                return this.loadTeamTotalStatistic$(matchId, filters);

              return this.loadPlayerStatisticImpact$(matchId, filters);
            }),
          );
        }),
        catchError((response: HttpErrorResponse) =>
          ApiErrorHandler.handleError(response, this.alertService),
        ),
        untilDestroyed(this),
      )
      .subscribe();
  }

  changeFilters(newFilters: MatchStatisticFiltersDto) {
    this.matchStatisticFiltersSubject.next(newFilters);
  }

  private loadTeamStatistic$(
    matchId: string,
    filters: MatchStatisticFiltersDto,
  ) {
    return this.matchEndpointService
      .getAllTeamsStatisticByMatch(matchId, filters)
      .pipe(
        tap((matchStatistic) =>
          this.matchTeamStatisticSubject.next(matchStatistic),
        ),
      );
  }

  private loadPlayerStatisticImpact$(
    matchId: string,
    filters: MatchStatisticFiltersDto,
  ) {
    return this.matchEndpointService
      .getPlayersImpactInMatch(matchId, filters)
      .pipe(
        tap((matchStatistic) =>
          this.matchPlayerImpactStatisticSubject.next(matchStatistic),
        ),
      );
  }

  private loadTeamTotalStatistic$(
    matchId: string,
    filters: MatchStatisticFiltersDto,
  ) {
    return this.matchEndpointService
      .getAllTotalTeamsStatisticByMatch(matchId, filters)
      .pipe(
        tap((matchStatistic) =>
          this.totalTeamStatisticSubject.next(matchStatistic),
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

  setCurrentMatchId(matchId: string): void {
    this.currentMatchIdSubject.next(matchId);
  }
}
