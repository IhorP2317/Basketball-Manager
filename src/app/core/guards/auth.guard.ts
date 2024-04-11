import { CanActivateFn, Router } from '@angular/router';
import { AlertService } from '../../shared/services/alert.service';
import { inject } from '@angular/core';
import { CurrentUserService } from '../../shared/services/current-user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(CurrentUserService);
  const router = inject(Router);
  const alertService = inject(AlertService);

  if (authService.getCurrentUser()) {
    console.log('AuthenticatedGuard::allowed');
    return true;
  }

  console.log('AuthenticatedGuard::forbidden');
  alertService.error('In order to access requested page, please login');
  router.navigate(['/login']);
  return false;
};
