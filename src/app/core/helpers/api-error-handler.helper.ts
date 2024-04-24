import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from '../../shared/services/alert.service';
import { Observable, throwError } from 'rxjs';
import { ApiError } from '../interfaces/errors/api-error';

export class ApiErrorHandler {
  static handleError(
    response: HttpErrorResponse,
    alertService: AlertService,
  ): Observable<never> {
    const apiError = response.error as ApiError;
    let errorMessage = apiError.detail || 'An unknown error occurred';
    if (apiError.errors) {
      const errorMessages = Object.entries(apiError.errors)
        .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
        .join('; ');
      errorMessage += `: ${errorMessages}`;
    }
    alertService.error(`Error: ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  }
}
