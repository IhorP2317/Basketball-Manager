import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserEndpointService } from '../../../core/services/user.endpoint.service';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { UserFiltersDto } from '../../../core/interfaces/user/user-filters.dto';
import { PagedListConfiguration } from '../../../core/interfaces/paged-list/paged-list-configuration.dto';
import { PagedList } from '../../../core/interfaces/paged-list/paged-list.model';
import { User } from '../../../core/interfaces/user/user.model';

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

  public filters$ = this.filtersSubject.asObservable().pipe(debounceTime(300));
  public pagedListSettings$ = this.pagedListSettingsSubject.asObservable();
  public pagedListUsers$ = this.pagedListUsersSubject.asObservable();

  constructor(private userEndpointService: UserEndpointService) {
    this.onFiltersAndPagingChange();
  }

  changeFilters(newFilters: UserFiltersDto): void {
    this.filtersSubject.next(newFilters);
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

  deleteUser(userId: string) {
    this.userEndpointService
      .deleteUser(userId)
      .pipe(
        tap(() => {
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
