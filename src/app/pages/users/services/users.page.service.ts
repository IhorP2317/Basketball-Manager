import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserEndpointService } from '../../../core/services/user.endpoint.service';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  forkJoin,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { UserFiltersDto } from '../../../core/interfaces/user/user-filters.dto';
import { PagedListConfiguration } from '../../../core/interfaces/paged-list/paged-list-configuration.dto';
import { PagedList } from '../../../core/interfaces/paged-list/paged-list.model';
import { User } from '../../../core/interfaces/user/user.model';
import { UserSignupDto } from '../../../core/interfaces/user/user-signup.dto';
import { AuthEndpointService } from '../../../core/services/auth.endpoint.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorHandler } from '../../../core/helpers/api-error-handler.helper';
import { AlertService } from '../../../shared/services/alert.service';
import { UserUpdateDto } from '../../../core/interfaces/user/user-update.dto';
import { CurrentUserService } from '../../../shared/services/current-user.service';

@UntilDestroy()
@Injectable()
export class UsersPageService {
  private filtersSubject = new BehaviorSubject<UserFiltersDto>({
    role: null,
    isEmailConfirmed: null,
  });
  private pagedListSettingsSubject =
    new BehaviorSubject<PagedListConfiguration>({
      page: 1,
      pageSize: 5,
    });
  private pagedListUsersSubject = new BehaviorSubject<PagedList<User> | null>(
    null,
  );

  public filters$ = this.filtersSubject.asObservable();
  public pagedListSettings$ = this.pagedListSettingsSubject.asObservable();
  public pagedListUsers$ = this.pagedListUsersSubject.asObservable();

  constructor(
    private userEndpointService: UserEndpointService,
    private authService: AuthEndpointService,
    private alertService: AlertService,
    private currentUserService: CurrentUserService,
  ) {
    this.onFiltersAndPagingChange();
    this.refreshUsers();
  }

  changeFilters(newFilters: UserFiltersDto): void {
    this.filtersSubject.next(newFilters);
    const updatedPageListSettings = {
      ...this.pagedListSettingsSubject.value,
      page: 1,
    };
    this.changePagedListSettings(updatedPageListSettings);
  }

  changePagedListSettings(pagedListSettings: PagedListConfiguration): void {
    this.pagedListSettingsSubject.next(pagedListSettings);
  }

  changeSortingSettings(sortColumn: string | null, sortOrder: boolean) {
    const filters = this.filtersSubject.value;

    this.changeFilters({
      ...filters,
      sortColumn: sortColumn,
      sortOrder: sortOrder ? 'desc' : 'asc',
    });
  }

  setSearchedUser(fullName: string | null) {
    const filters = this.filtersSubject.value;
    this.changeFilters({
      ...filters,
      searchTerm: fullName,
    });
  }

  setSelectedRole(role: string | null) {
    const filters = this.filtersSubject.value;
    this.changeFilters({
      ...filters,
      role: role,
    });
  }

  setSelectedEmailStatus(status: boolean | null) {
    const filters = this.filtersSubject.value;
    this.changeFilters({
      ...filters,
      isEmailConfirmed: status,
    });
  }

  private onFiltersAndPagingChange(): void {
    combineLatest([this.filters$, this.pagedListSettings$])
      .pipe(
        switchMap(([filters, pagedListSettings]) =>
          this.loadUsersList$(filters, pagedListSettings),
        ),
        untilDestroyed(this),
      )
      .subscribe();
  }

  createUser(
    user: UserSignupDto,
    role: string,
    userImage?: File | null,
    balance?: number | null,
  ) {
    let userRegistration$;

    console.log(role);
    if (role === 'Admin') {
      userRegistration$ = this.authService.registerAdmin(user);
    } else {
      userRegistration$ = this.authService.signUp(user);
    }

    userRegistration$
      .pipe(
        switchMap((registeredUser) => {
          const avatarUpdate$ = userImage
            ? this.userEndpointService.updateUserAvatar(
                registeredUser.id,
                userImage,
              )
            : of(null);

          const balanceUpdate$ =
            balance != null
              ? this.userEndpointService.updateUserBalance(
                  registeredUser.id,
                  balance,
                )
              : of(null);

          return forkJoin({
            avatarUpdate: avatarUpdate$,
            balanceUpdate: balanceUpdate$,
          });
        }),
        tap(() => this.refreshUsers()),
        catchError((error: HttpErrorResponse) =>
          ApiErrorHandler.handleError(error, this.alertService),
        ),
        untilDestroyed(this),
      )
      .subscribe();
  }

  updateUser(
    userId: string,
    user: UserUpdateDto,
    userImage?: File | null | undefined,
    balance?: number | null | undefined,
  ) {
    this.userEndpointService
      .updateUser(userId, user)
      .pipe(
        tap(() => {
          const currentUser = this.currentUserService.getCurrentUser();
          if (currentUser?.id === userId) {
            this.currentUserService.setCurrentUser({
              ...currentUser,
              firstName: user.firstName,
              lastName: user.lastName,
            });
          }
        }),
        switchMap(() => {
          const avatarUpdate$ = userImage
            ? this.userEndpointService
                .updateUserAvatar(userId, userImage)
                .pipe(
                  catchError((response: HttpErrorResponse) =>
                    ApiErrorHandler.handleError(response, this.alertService),
                  ),
                )
            : of(null);

          const balanceUpdate$ =
            balance != null
              ? this.userEndpointService
                  .updateUserBalance(userId, balance)
                  .pipe(
                    catchError((response: HttpErrorResponse) =>
                      ApiErrorHandler.handleError(response, this.alertService),
                    ),
                  )
              : of(null);
          return forkJoin({
            avatarUpdate: avatarUpdate$,
            balanceUpdate: balanceUpdate$,
          });
        }),
        tap(() => this.refreshUsers()),
        untilDestroyed(this),
      )
      .subscribe();
  }

  deleteUser(userId: string) {
    this.userEndpointService
      .deleteUser(userId)
      .pipe(
        tap(() => {
          if (
            this.pagedListUsersSubject.value!.hasPreviousPage &&
            this.pagedListUsersSubject.value!.items.length === 1
          ) {
            const pageListSettings = this.pagedListSettingsSubject.value;
            pageListSettings.page = pageListSettings.page - 1;
            this.changePagedListSettings(pageListSettings);
          }
          this.refreshUsers();
        }),
        catchError((error) => {
          console.error('Error deleting match:', error);
          return of(null);
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }

  private refreshUsers() {
    const currentFilters = this.filtersSubject.value;
    const currentPagedListSettings = this.pagedListSettingsSubject.value;
    this.loadUsersList$(currentFilters, currentPagedListSettings)
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  private loadUsersList$(
    filters: UserFiltersDto,
    pagedListSettings: PagedListConfiguration,
  ) {
    return this.userEndpointService
      .getAllUsers(filters, pagedListSettings)
      .pipe(
        tap((users) => {
          this.pagedListUsersSubject.next(users);
          console.log(users);
        }),
      );
  }
}
