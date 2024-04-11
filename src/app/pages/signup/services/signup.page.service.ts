import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthEndpointService } from '../../../core/services/auth.endpoint.service';
import { UserSignupDto } from '../../../core/interfaces/user/user-signup.dto';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { catchError, of } from 'rxjs';
import { AlertService } from '../../../shared/services/alert.service';

@UntilDestroy()
@Injectable()
export class SignupPageService {
  constructor(
    private router: Router,
    private authEndpointService: AuthEndpointService,
    private alertService: AlertService,
  ) {}

  signUp(userSignUpDto: UserSignupDto) {
    this.authEndpointService
      .signUp(userSignUpDto)
      .pipe(
        untilDestroyed(this),
        catchError((err) => {
          let errMsg = err.error.detail;
          this.alertService.error(errMsg);
          return of();
        }),
      )
      .subscribe(() => {
        this.alertService.success('Sign up success');
        this.router.navigateByUrl('/login');
      });
  }
}
