import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { AwardEndpointService } from '../../../core/services/award.endpoint.service';
import { PlayerEndpointService } from '../../../core/services/player.endpoint.service';
import { PlayerExperienceEndpointService } from '../../../core/services/player-experience.endpoint.service';
import { PlayerAwardEndpointService } from '../../../core/services/player-award.endpoint.service';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  EMPTY,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ApiErrorHandler } from '../../../core/helpers/api-error-handler.helper';
import { StaffExperienceUpdateDto } from '../../../core/interfaces/staff-experience/staff-experience-update.dto';
import { AwardRequestDto } from '../../../core/interfaces/awards/award-request.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { StaffExperienceDto } from '../../../core/interfaces/staff-experience/staff-experience.dto';

import moment from 'moment';
import { TotalPlayerStatisticFiltersDto } from '../../../core/interfaces/statistic/total-player-statistic-filters.dto';
import { TotalAnnuallyPlayerStatistic } from '../../../core/interfaces/statistic/total-annually-player-statistic.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable()
export class PlayerPageService {
  private currentPlayerIdSubject = new BehaviorSubject<string | null>(null);
  private filtersSubject = new BehaviorSubject<TotalPlayerStatisticFiltersDto>({
    year: null,
  });
  private totalAnnuallyPlayerStatisticsSubject = new BehaviorSubject<
    TotalAnnuallyPlayerStatistic[] | null
  >(null);
  private yearsFiltersSubject = new BehaviorSubject<number[]>([
    moment().year(),
  ]);
  public filters$ = this.filtersSubject.asObservable();
  public totalAnnuallyPlayerStatistics$ =
    this.totalAnnuallyPlayerStatisticsSubject.asObservable();
  public yearsFilters$ = this.yearsFiltersSubject.asObservable();
  public currentPlayerId$ = this.currentPlayerIdSubject.asObservable();

  constructor(
    private playerEndpointService: PlayerEndpointService,
    private router: Router,
    private alertService: AlertService,
    private playerExperienceEndpointService: PlayerExperienceEndpointService,
    private playerAwardEndpointService: PlayerAwardEndpointService,
    private awardEndpointService: AwardEndpointService,
  ) {
    combineLatest([this.filters$, this.currentPlayerId$])
      .pipe(
        switchMap(([filters, playerId]) => {
          if (!playerId) return of(null);
          return combineLatest([
            this.loadPlayerStatistic$(playerId, filters),
            this.loadPlayersYears$(playerId),
          ]);
        }),
        catchError((response: HttpErrorResponse) =>
          ApiErrorHandler.handleError(response, this.alertService),
        ),
        untilDestroyed(this),
      )
      .subscribe();
  }

  changeFilters(newFilters: TotalPlayerStatisticFiltersDto): void {
    this.filtersSubject.next(newFilters);
  }

  setCurrentPlayerId(playerId: string): void {
    this.currentPlayerIdSubject.next(playerId);
  }

  private loadPlayersYears$(playerId: string) {
    return this.playerEndpointService.getPlayerYears(playerId).pipe(
      tap((years) => {
        this.yearsFiltersSubject.next(years);
      }),
    );
  }

  private loadPlayerStatistic$(
    playerId: string,
    filters: TotalPlayerStatisticFiltersDto,
  ) {
    return this.playerEndpointService
      .getAllAnnuallyPlayerStatistic(playerId, filters)
      .pipe(
        tap((totalPlayerStatistic) =>
          this.totalAnnuallyPlayerStatisticsSubject.next(totalPlayerStatistic),
        ),
      );
  }

  deletePlayerExperience$(playerExperienceId: string) {
    return this.playerExperienceEndpointService
      .deletePlayerExperience(playerExperienceId)
      .pipe(
        catchError((error) =>
          ApiErrorHandler.handleError(error, this.alertService),
        ),
      );
  }

  createPlayerExperience$(
    playerId: string,
    playerExperience: StaffExperienceDto,
  ) {
    return this.playerExperienceEndpointService
      .createPlayerExperience(playerId, playerExperience)
      .pipe(
        catchError((error) =>
          ApiErrorHandler.handleError(error, this.alertService),
        ),
      );
  }

  updatePlayerExperience$(
    playerExperienceId: string,
    playerExperienceDto: StaffExperienceUpdateDto,
  ) {
    return this.playerExperienceEndpointService
      .updatePlayerExperience(playerExperienceId, playerExperienceDto)
      .pipe(
        catchError((error) =>
          ApiErrorHandler.handleError(error, this.alertService),
        ),
      );
  }

  createPlayerAward$(
    playerExperienceId: string,
    awardRequestDto: AwardRequestDto,
    awardImage?: File | null | undefined,
  ) {
    return this.playerAwardEndpointService
      .createPlayerAward(playerExperienceId, awardRequestDto)
      .pipe(
        switchMap((award) =>
          awardImage
            ? this.awardEndpointService.updateAvatar(award.id, awardImage)
            : of(null),
        ),
        catchError((response: HttpErrorResponse) =>
          ApiErrorHandler.handleError(response, this.alertService),
        ),
      );
  }

  deletePlayerAward$(coachExperienceId: string, awardId: string) {
    return this.playerAwardEndpointService
      .deleteCoachAward(coachExperienceId, awardId)
      .pipe(
        catchError((error) =>
          ApiErrorHandler.handleError(error, this.alertService),
        ),
      );
  }

  loadPlayer$(playerId: string) {
    return this.playerEndpointService.getPlayerDetail(playerId).pipe(
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
}
