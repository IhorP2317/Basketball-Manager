import { CanActivateFn, Router } from '@angular/router';
import { AlertService } from '../../shared/services/alert.service';
import { inject } from '@angular/core';
import { CurrentUserService } from '../../shared/services/current-user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const currentUserService = inject(CurrentUserService);
  const router = inject(Router);
  const alertService = inject(AlertService);
  const currentUser = currentUserService.getCurrentUser();

  const userRole = currentUser?.role;
  console.log(currentUser);
  console.log(userRole);
  if (userRole === 'Admin' || userRole === 'SuperAdmin') {
    console.log('adminGuard::allowed');

    return true;
  } else {
    console.log('adminGuard::forbidden');
    alertService.error('Access denied!');
    router.navigate(['/access-forbidden']);
    return false;
  }
};
