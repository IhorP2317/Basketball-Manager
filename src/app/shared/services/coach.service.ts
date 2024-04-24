import { Injectable } from '@angular/core';

import { AlertService } from './alert.service';
import { CoachEndpointService } from '../../core/services/coach.endpoint.service';
import { catchError, of, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { StaffUpdateTeamDto } from '../../core/interfaces/staff/staff-update-team.dto';
import { CoachRequestDto } from '../../core/interfaces/coach/coach-request.dto';
import { ApiErrorHandler } from '../../core/helpers/api-error-handler.helper';

@Injectable({
  providedIn: 'root',
})
export class CoachService {
  constructor(
    private coachEndpointService: CoachEndpointService,
    private alertService: AlertService,
  ) {}

  deleteCoach$(coachId: string) {
    return this.coachEndpointService
      .deleteCoach(coachId)
      .pipe(
        catchError((response) =>
          ApiErrorHandler.handleError(response, this.alertService),
        ),
      );
  }

  createCoach$(coach: CoachRequestDto, coachImage?: File | null | undefined) {
    return this.coachEndpointService.createCoach(coach).pipe(
      switchMap((coach) =>
        coachImage
          ? this.coachEndpointService.updateCoachAvatar(coach.id, coachImage)
          : of([]),
      ),
      catchError((response: HttpErrorResponse) =>
        ApiErrorHandler.handleError(response, this.alertService),
      ),
    );
  }

  updateCoach$(
    coachId: string,
    coach: CoachRequestDto,
    coachImage?: File | null | undefined,
  ) {
    const coachUpdateDto: CoachRequestDto = {
      ...coach,
    };
    const staffUpdateTeamDto: StaffUpdateTeamDto = {
      newTeamId: coach.teamId,
    };

    return this.coachEndpointService.updateCoach(coachId, coachUpdateDto).pipe(
      switchMap(() =>
        this.coachEndpointService.updateCoachTeam(coachId, staffUpdateTeamDto),
      ),
      switchMap(() =>
        coachImage
          ? this.coachEndpointService.updateCoachAvatar(coachId, coachImage)
          : of([]),
      ),
      catchError((response: HttpErrorResponse) =>
        ApiErrorHandler.handleError(response, this.alertService),
      ),
    );
  }
}
