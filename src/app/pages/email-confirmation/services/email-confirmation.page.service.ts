import { Injectable } from '@angular/core';
import { AuthEndpointService } from '../../../core/services/auth.endpoint.service';
import { AlertService } from '../../../shared/services/alert.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, catchError, throwError } from 'rxjs';

@UntilDestroy()
@Injectable()
export class EmailConfirmationPageService {
  private emailConfirmedSource = new BehaviorSubject<boolean | null>(null);
  public emailConfirmed$ = this.emailConfirmedSource.asObservable();

  constructor(
    private authEndpointService: AuthEndpointService,
    private alertService: AlertService,
  ) {}

  confirmEmail(userId: string, token: string) {
    this.authEndpointService
      .confirmEmail(userId, token)
      .pipe(
        untilDestroyed(this),
        catchError((err) => {
          console.log(err);
          let errMsg = err.error.detail;
          this.emailConfirmedSource.next(false);
          return throwError(() => new Error(errMsg));
        }),
      )
      .subscribe({
        next: () => {
          this.alertService.success('Email confirmed successfully!');
          this.emailConfirmedSource.next(true);
        },
        error: (error) => {
          this.alertService.error(error.message || 'Failed to confirm email.');
          this.emailConfirmedSource.next(false);
        },
      });
  }
}
