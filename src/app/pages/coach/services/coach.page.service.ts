import { Injectable } from '@angular/core';
import { CoachEndpointService } from '../../../core/services/coach.endpoint.service';
import { AlertService } from '../../../shared/services/alert.service';
import { Router } from '@angular/router';
import { catchError, EMPTY, of, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandler } from '../../../core/helpers/api-error-handler.helper';
import { CoachExperienceEndpointService } from '../../../core/services/coach-experience.endpoint.service';
import { CoachAwardEndpointService } from '../../../core/services/coach-award.endpoint.service';
import { CoachExperienceDto } from '../../../core/interfaces/staff-experience/coach-experience.dto';
import { AwardEndpointService } from '../../../core/services/award.endpoint.service';
import { AwardRequestDto } from '../../../core/interfaces/awards/award-request.dto';
import { StaffExperienceUpdateDto } from '../../../core/interfaces/staff-experience/staff-experience-update.dto';

@Injectable()
export class CoachPageService {
  constructor(
    private coachEndpointService: CoachEndpointService,
    private router: Router,
    private alertService: AlertService,
    private coachExperienceEndpointService: CoachExperienceEndpointService,
    private coachAwardEndpointService: CoachAwardEndpointService,
    private awardEndpointService: AwardEndpointService,
  ) {}

  deleteCoachExperience$(coachExperienceId: string) {
    return this.coachExperienceEndpointService
      .deleteCoachExperience(coachExperienceId)
      .pipe(
        catchError((error) =>
          ApiErrorHandler.handleError(error, this.alertService),
        ),
      );
  }

  createCoachExperience$(coachId: string, coachExperience: CoachExperienceDto) {
    return this.coachExperienceEndpointService
      .createCoachExperience(coachId, coachExperience)
      .pipe(
        catchError((error) =>
          ApiErrorHandler.handleError(error, this.alertService),
        ),
      );
  }

  updateCoachExperience$(
    coachExperienceId: string,
    coachExperienceDto: StaffExperienceUpdateDto,
  ) {
    return this.coachExperienceEndpointService
      .updateCoachExperience(coachExperienceId, coachExperienceDto)
      .pipe(
        catchError((error) =>
          ApiErrorHandler.handleError(error, this.alertService),
        ),
      );
  }

  createCoachAward$(
    coachExperienceId: string,
    awardRequestDto: AwardRequestDto,
    awardImage?: File | null | undefined,
  ) {
    return this.coachAwardEndpointService
      .createCoachAward(coachExperienceId, awardRequestDto)
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

  deleteCoachAward$(coachExperienceId: string, awardId: string) {
    return this.coachAwardEndpointService
      .deleteCoachAward(coachExperienceId, awardId)
      .pipe(
        catchError((error) =>
          ApiErrorHandler.handleError(error, this.alertService),
        ),
      );
  }

  loadCoach$(coachId: string) {
    return this.coachEndpointService.getCoachDetail(coachId).pipe(
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
