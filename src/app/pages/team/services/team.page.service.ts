import { Injectable } from '@angular/core';
import { TeamEndpointService } from '../../../core/services/team.endpoint.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { catchError, EMPTY } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandler } from '../../../core/helpers/api-error-handler.helper';

@Injectable()
export class TeamPageService {
  constructor(
    private teamEndpointService: TeamEndpointService,
    private router: Router,
    private alertService: AlertService,
  ) {}

  loadTeam$(teamId: string) {
    return this.teamEndpointService.getTeamDetail(teamId).pipe(
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
