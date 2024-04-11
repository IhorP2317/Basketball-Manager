import { Component, OnInit } from '@angular/core';
import {
  EMAIL_STATUSES,
  USER_ROLES,
} from '../../shared/constants/selectOption.constant';
import { PagedListConfiguration } from '../../core/interfaces/paged-list/paged-list-configuration.dto';
import { UsersPageService } from './services/users.page.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../core/interfaces/user/user.model';
import { DialogData } from '../../core/interfaces/dialog/dialog-data';
import { ConfirmationDialogComponent } from '../../shared/components/dialog/confirmation-dialog.component';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatDialog } from '@angular/material/dialog';

@UntilDestroy()
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [UsersPageService],
})
export class UsersComponent implements OnInit {
  currentSortColumn: string = 'default';
  isDescendingSortingOrder = false;
  usersFiltersForm!: FormGroup;
  roles = USER_ROLES;
  statuses = EMAIL_STATUSES;
  filters = this.userPageService.filters$;
  pagedUserList = this.userPageService.pagedListUsers$;

  constructor(
    private userPageService: UsersPageService,
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) {
    this.usersFiltersForm = this.fb.group({
      role: [this.roles[0].value],
      emailStatus: [this.statuses[0].value],
      searchUser: [''],
    });
  }

  ngOnInit(): void {
    this.usersFiltersForm
      .get('role')
      ?.valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((role) => {
        this.userPageService.setSelectedRole(
          role === 'All roles' ? null : role,
        );
      });

    this.usersFiltersForm
      .get('emailStatus')
      ?.valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((status) => {
        if (status === 'All statuses') {
          this.userPageService.setSelectedEmailStatus(null);
        } else {
          const emailStatus =
            status === 'Confirmed'
              ? true
              : status === 'Unconfirmed'
                ? false
                : null;
          this.userPageService.setSelectedEmailStatus(emailStatus);
        }
      });

    this.usersFiltersForm
      .get('searchUser')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        untilDestroyed(this),
      )
      .subscribe((searchTerm) => {
        const trimmedSearchTerm = searchTerm.trim();
        this.userPageService.setSearchedUser(
          trimmedSearchTerm.length > 0 ? trimmedSearchTerm : null,
        );
      });
  }

  onSelectedRoleChange() {
    const selectedRole = this.usersFiltersForm?.get('role')?.value;
    if (selectedRole === 'All roles') {
      this.userPageService.setSelectedRole(null);
    } else {
      this.userPageService.setSelectedRole(selectedRole);
    }
  }

  onSelectedStatusChange() {
    const selectedStatus = this.usersFiltersForm?.get('emailStatus')?.value;
    if (selectedStatus === 'All statuses') {
      this.userPageService.setSelectedEmailStatus(null);
    } else {
      if (selectedStatus === 'Confirmed') {
        this.userPageService.setSelectedEmailStatus(true);
      }
      if (selectedStatus === 'Unconfirmed') {
        this.userPageService.setSelectedEmailStatus(false);
      }
    }
  }

  onSortColumnClicked(sortColumn: string) {
    if (this.currentSortColumn === sortColumn) {
      this.isDescendingSortingOrder = !this.isDescendingSortingOrder;
    } else {
      this.isDescendingSortingOrder = false;
    }
    this.currentSortColumn = sortColumn;
    this.userPageService.changeSortingSettings(
      sortColumn,
      this.isDescendingSortingOrder,
    );
  }

  onPageChangedEvent(pagingConfiguration: PagedListConfiguration) {
    this.userPageService.changePagedListSettings(pagingConfiguration);
  }

  onDeleteUserClicked(user: User): void {
    const dialogData: DialogData = {
      title: 'Confirm Action',
      message: `Are you sure you want to delete ${user.lastName + ' ' + user.firstName}?`,
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result),
        untilDestroyed(this),
      )
      .subscribe(() => this.userPageService.deleteUser(user.id));
  }
}
