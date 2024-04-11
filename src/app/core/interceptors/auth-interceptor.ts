import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, finalize, Observable, switchMap, throwError } from 'rxjs';
import { AuthEndpointService } from '../services/auth.endpoint.service';
import { AlertService } from '../../shared/services/alert.service';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { SpinnerService } from '../../shared/services/spinner.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthEndpointService,
    private alertService: AlertService,
    private currentUserService: CurrentUserService,
    private spinnerService: SpinnerService,
  ) {}

  public intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    this.spinnerService.show();
    if (request.url.includes('auth/login')) {
      return next
        .handle(request)
        .pipe(finalize(() => this.spinnerService.hide()));
    }
    return this.processRequestWithToken(request, next).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.currentUserService
            .refreshToken()
            .pipe(switchMap(() => this.processRequestWithToken(request, next)));
        }
        if (error instanceof HttpErrorResponse && error.status === 403) {
          console.log('Access denied!');
        }

        return throwError(error);
      }),
      finalize(() => this.spinnerService.hide()),
    );
  }

  private processRequestWithToken(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = this.currentUserService.getTokensPair();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });
    }
    return next.handle(request);
  }
}
