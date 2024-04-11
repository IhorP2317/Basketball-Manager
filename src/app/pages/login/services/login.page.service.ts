import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthEndpointService } from '../../../core/services/auth.endpoint.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserLoginDto } from '../../../core/interfaces/user/user-login.dto';
import { catchError, throwError } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { AlertService } from '../../../shared/services/alert.service';
import { CurrentUserService } from '../../../shared/services/current-user.service';

@UntilDestroy()
@Injectable()
export class LoginPageService {
  constructor(
    private router: Router,
    private authEndpointService: AuthEndpointService,
    private alertService: AlertService,
    private currentUserService: CurrentUserService,
  ) {}

  login(userLoginDto: UserLoginDto) {
    this.authEndpointService
      .login(userLoginDto)
      .pipe(
        untilDestroyed(this),
        catchError((err) => {
          console.log(err);
          let errMsg: string;

          if (err.error.status == HttpStatusCode.Unauthorized)
            errMsg = 'Invalid password';
          else errMsg = err.error.detail;
          //this.alertService.error(errMsg);
          return throwError(() => new Error(errMsg));
        }),
      )
      .subscribe({
        next: (data) => {
          this.currentUserService.setCurrentUser(data.payload);
          this.currentUserService.setTokensPair(data.bearerToken);
          this.router.navigate(['/matches']);
        },
        error: (error) => {
          this.alertService.error(error);
        },
      });
  }
}
