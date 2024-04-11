import { Injectable } from '@angular/core';
import { AuthEndpointService } from '../../../core/services/auth.endpoint.service';
import { AlertService } from '../../../shared/services/alert.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, throwError } from 'rxjs';
import { ResetPasswordDto } from '../../../core/interfaces/password/reset-password.dto';

@UntilDestroy()
@Injectable()
export class ResetPasswordPageService {
  constructor(
    private authEndpointService: AuthEndpointService,
    private alertService: AlertService,
  ) {}

  resetPassword(resetPasswordDto: ResetPasswordDto) {
    this.authEndpointService
      .resetPassword(resetPasswordDto)
      .pipe(
        untilDestroyed(this),
        catchError((err) => {
          console.log(err);

          let errMsg = err.error.detail;
          return throwError(() => new Error(errMsg));
        }),
      )
      .subscribe({
        next: () => {
          this.alertService.success(
            'Password change successfully! Please login.',
          );
        },
        error: (error) => {
          this.alertService.error(error);
        },
      });
  }
}
