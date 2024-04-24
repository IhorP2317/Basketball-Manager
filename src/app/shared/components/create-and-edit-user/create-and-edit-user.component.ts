import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { USER_ACTIONS_ROLES } from '../../constants/selectOption.constant';
import { UserActionsForm } from '../../../core/interfaces/forms/user/user-actions-form';
import { UserSignupDto } from '../../../core/interfaces/user/user-signup.dto';
import { UserUpdateDto } from '../../../core/interfaces/user/user-update.dto';
import { CurrentUserService } from '../../services/current-user.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-create-and-edit-user',
  templateUrl: './create-and-edit-user.component.html',
  styleUrl: './create-and-edit-user.component.scss',
})
export class CreateAndEditUserComponent implements OnInit {
  @Input() form!: FormGroup<UserActionsForm>;
  @Input() action!: 'Create' | 'Edit';
  @Output() closed = new EventEmitter<void>();
  @Output() createRequested = new EventEmitter<{
    userDto: UserSignupDto;
    role: string;
    userImage: File | null | undefined;
    balance: number | null | undefined;
  }>();
  @Output() updateRequested = new EventEmitter<{
    id: string;
    userDto: UserUpdateDto;
    userImage: File | null | undefined;
    balance: number | null | undefined;
  }>();
  userImage!: File;
  roles = USER_ACTIONS_ROLES;
  errorMessage: string | null = null;

  constructor(private currentUserService: CurrentUserService) {}

  ngOnInit() {
    this.currentUserService.isAdminOrSuperAdmin$
      .pipe(untilDestroyed(this))
      .subscribe((isAdminOrSuperAdmin) => {
        if (isAdminOrSuperAdmin) {
          this.roles =
            this.currentUserService.getCurrentUser()?.role === 'SuperAdmin'
              ? [{ value: 'Admin' }, { value: 'User' }]
              : [{ value: 'User' }];
        }
      });
  }

  onSubmit() {
    console.log(this.userImage);
    if (this.action === 'Create') {
      this.createUser();
    } else if (this.action === 'Edit') {
      this.updateUser();
    }
  }

  hidePassword: boolean = true;

  createUser() {
    if (this.form.valid) {
      this.createRequested.emit({
        userDto: this.buildUserDto() as UserSignupDto,
        role: this.form.value.role!,
        userImage: this.userImage,
        balance: this.form.value.balance,
      });
      this.closed.emit();
    }
  }

  updateUser() {
    if (this.form.valid) {
      this.updateRequested.emit({
        id: this.form.value.id!,
        userDto: this.buildUserDto() as UserUpdateDto,
        userImage: this.userImage,
        balance: this.form.value.balance,
      });
      this.closed.emit();
    }
  }

  buildUserDto(): UserSignupDto | UserUpdateDto {
    const baseDto = {
      firstName: this.form.value.firstName!,
      lastName: this.form.value.lastName!,
    };

    if (this.action === 'Create') {
      return {
        ...baseDto,
        email: this.form.value.email!,
        password: this.form.value.password!,
      };
    } else {
      return baseDto;
    }
  }

  handleImageFile(image: File) {
    this.userImage = image;
  }
}
