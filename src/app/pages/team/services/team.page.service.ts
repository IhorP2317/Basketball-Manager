import { Injectable } from '@angular/core';
import { TeamEndpointService } from '../../../core/services/team.endpoint.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../shared/services/alert.service';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../../../core/interfaces/errors/api-error';

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
        const apiError = response.error as ApiError;
        let errorMessage = apiError.title || 'An unknown error occurred';
        if (apiError.errors) {
          const errorMessages = Object.entries(apiError.errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('; ');
          errorMessage += `: ${errorMessages}`;
        }

        this.alertService.error(
          `Error during the fetching team: ${errorMessage}`,
        );

        return throwError(() => new Error(errorMessage));
      }),
    );
  }
}
