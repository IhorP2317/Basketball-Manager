import { Injectable } from '@angular/core';
import { AuthEndpointService } from '../../../core/services/auth.endpoint.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, throwError } from 'rxjs';
import { AlertService } from '../../../shared/services/alert.service';
import { ForgotPasswordDto } from '../../../core/interfaces/password/forgot-password.dto';

@UntilDestroy()
@Injectable()
export class ForgotPasswordPageService {
  constructor(
    private authEndpointService: AuthEndpointService,
    private alertService: AlertService,
  ) {}

  forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    this.authEndpointService
      .forgotPassword(forgotPasswordDto)
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
          this.alertService.success('Email sent successfully');
        },
        error: (error) => {
          this.alertService.error(error);
        },
      });
  }
}
