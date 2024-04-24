import { Component, Inject, OnInit } from '@angular/core';
import {
  EMAIL_STATUSES,
  USER_ROLES,
} from '../../shared/constants/selectOption.constant';
import { PagedListConfiguration } from '../../core/interfaces/paged-list/paged-list-configuration.dto';
import { UsersPageService } from './services/users.page.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from '../../core/interfaces/user/user.model';
import { DialogData } from '../../core/interfaces/dialog/dialog-data';
import { ConfirmationDialogComponent } from '../../shared/components/dialog/confirmation-dialog.component';
import { debounceTime, distinctUntilChanged, filter, take } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatDialog } from '@angular/material/dialog';
import { UserSignupDto } from '../../core/interfaces/user/user-signup.dto';
import { UserUpdateDto } from '../../core/interfaces/user/user-update.dto';
import { UserActionsForm } from '../../core/interfaces/forms/user/user-actions-form';
import {
  DEFAULT_PASSWORD,
  NAME_PATTERN,
  PASSWORD_PATTERN,
} from '../../shared/constants/form.constant';
import { passwordsMatchValidator } from '../../shared/validators/form-validators';
import { ImageInspectorService } from '../../shared/services/image-inspector.service';

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
  userActionsForm!: FormGroup<UserActionsForm>;
  roles = USER_ROLES;
  statuses = EMAIL_STATUSES;
  filters = this.userPageService.filters$;
  pagedUserList = this.userPageService.pagedListUsers$;

  constructor(
    private userPageService: UsersPageService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private imageInspectorService: ImageInspectorService,
    @Inject('apiUrl') private apiUrl: string,
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
    this.initializeUserForm();
  }

  initializeUserForm() {
    this.userActionsForm = new FormGroup<UserActionsForm>({
      id: new FormControl(''),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_PATTERN),
      ]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_PATTERN),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(PASSWORD_PATTERN),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        passwordsMatchValidator('password'),
      ]),
      balance: new FormControl(0, [Validators.min(0)]),
      avatar: new FormControl(null),
      role: new FormControl(''),
    });
  }

  fillCreateUserForm() {
    this.userActionsForm.reset();
    this.userActionsForm.controls.id.setValue('');
    this.userActionsForm.controls.firstName.setValue('');
    this.userActionsForm.controls.lastName.setValue('');
    this.userActionsForm.controls.email.setValue('');
    this.userActionsForm.controls.password.setValue('');
    this.userActionsForm.controls.confirmPassword.setValue('');
    this.userActionsForm.controls.balance.setValue(0);
    this.userActionsForm.controls.avatar.setValue(null);
    this.userActionsForm.controls.role.setValue('User');
  }

  fillUpdateUserForm(user: User) {
    this.userActionsForm.reset();
    this.userActionsForm.controls.id.setValue(user.id);
    this.userActionsForm.controls.firstName.setValue(user.firstName);
    this.userActionsForm.controls.lastName.setValue(user.lastName);
    this.userActionsForm.controls.email.setValue(user.email);
    this.userActionsForm.controls.balance.setValue(user.balance);
    this.userActionsForm.controls.password.setValue(DEFAULT_PASSWORD);
    this.userActionsForm.controls.confirmPassword.setValue(DEFAULT_PASSWORD);
    this.userActionsForm.controls.role.setValue(user.role);

    const avatarUrl = this.apiUrl + `/users/${user.id}/avatar`;

    this.imageInspectorService
      .checkImageURL(avatarUrl)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((exists) => {
        const avatarValue = exists ? avatarUrl : null;
        this.userActionsForm.controls.avatar.setValue(avatarValue);
      });
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

  handleCreateUser(eventData: {
    userDto: UserSignupDto;
    role?: string;
    userImage?: File | null;
    balance?: number | null | undefined;
  }) {
    console.log(eventData.role);
    const role = eventData.role;

    this.userPageService.createUser(
      eventData.userDto,
      role!,
      eventData.userImage,
      eventData.balance,
    );
  }

  handleUpdateUser(eventData: {
    id: string;
    userDto: UserUpdateDto;
    userImage?: File | null | undefined;
    balance?: number | null | undefined;
  }) {
    this.userPageService.updateUser(
      eventData.id,
      eventData.userDto,
      eventData.userImage,
      eventData.balance,
    );
  }
}
