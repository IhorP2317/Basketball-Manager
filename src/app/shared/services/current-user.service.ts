import { Injectable } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { User } from '../../core/interfaces/user/user.model';
import { Token } from '../../core/interfaces/token/token';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { AuthEndpointService } from '../../core/services/auth.endpoint.service';
import { HttpErrorResponse } from '@angular/common/http';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  private currentUserSubject = new BehaviorSubject<User | null>(
    this.getCurrentUser(),
  );
  private tokensPairSubject = new BehaviorSubject<Token | null>(
    this.getTokensPair(),
  );
  public currentUser$ = this.currentUserSubject.asObservable();
  public tokensPair$ = this.tokensPairSubject.asObservable();
  public isAdminOrSuperAdmin$ = this.currentUser$.pipe(
    map(
      (user) => user && (user.role === 'Admin' || user.role === 'SuperAdmin'),
    ),
    distinctUntilChanged(),
  );

  constructor(
    private router: Router,
    private authEndpointService: AuthEndpointService,
  ) {}

  logOut() {
    this.removeCurrentUser();
    this.router.navigateByUrl('/login');
  }

  isAdminOrSuperAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return (
      currentUser != null &&
      (currentUser.role === 'Admin' || currentUser.role === 'SuperAdmin')
    );
  }

  refreshToken(): Observable<any> {
    const currentToken = this.tokensPairSubject.value;
    if (!currentToken) {
      console.error('No current token available for refresh.');
      this.logOut();
      return of(null);
    }

    return this.authEndpointService.refreshAccessToken(currentToken).pipe(
      tap((newToken) => {
        console.log('Token refreshed successfully');
        this.setTokensPair(newToken);
      }),
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          console.log('Session expired. Logging out.');
          this.logOut();
          return of(null);
        }
        console.error('Error refreshing token:', error);
        return throwError(() => new Error('Error refreshing token'));
      }),
    );
  }

  isUserCanEdit(userToEdit: User) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return false;
    }

    const userToUpdateRole = userToEdit.role;
    const currentUserRole = currentUser.role;
    const currentUserId = currentUser.id;
    const userToUpdateId = userToEdit.id;

    if (
      currentUserRole === 'User' &&
      (!userToUpdateRole.includes('User') ||
        currentUserId !== userToUpdateId.toString())
    ) {
      return false;
    }

    if (
      currentUserRole === 'Admin' &&
      userToUpdateRole.includes('SuperAdmin')
    ) {
      return false;
    }

    return !(
      currentUserRole === 'Admin' &&
      userToUpdateRole === 'Admin' &&
      currentUserId !== userToUpdateId.toString()
    );
  }

  isUserCanRemove(userToRemove: User) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return false;
    }

    const userToDeleteRole = userToRemove.role;
    const currentUserRole = currentUser.role;
    if (userToDeleteRole.includes('SuperAdmin')) {
      return false;
    }
    return !(userToDeleteRole === 'Admin' && currentUserRole !== 'SuperAdmin');
  }

  removeCurrentUser() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('bearerToken');
    this.currentUserSubject.next(null);
    this.tokensPairSubject.next(null);
  }

  setCurrentUser(user: User): void {
    console.log(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  setTokensPair(token: Token): void {
    console.log('setting tokens to localstorage');
    console.log(token);
    localStorage.setItem('bearerToken', JSON.stringify(token));
    this.tokensPairSubject.next(token);
  }

  getCurrentUser(): User | null {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser != null ? JSON.parse(currentUser) : null;
  }

  getTokensPair(): Token | null {
    const tokens = localStorage.getItem('bearerToken');
    return tokens != null ? JSON.parse(tokens) : null;
  }
}
