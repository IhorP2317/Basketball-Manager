import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetPasswordPageService } from './services/reset-password.page.service';
import { PASSWORD_PATTERN } from '../../shared/constants/form.constant';
import { ResetPasswordDto } from '../../core/interfaces/password/reset-password.dto';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  providers: [ResetPasswordPageService],
})
export class ResetPasswordComponent implements OnInit {
  errorMessage: string | null = null;
  hidePassword: boolean = true;
  resetPasswordForm!: FormGroup;
  userId!: string;
  token!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private resetPasswordPageService: ResetPasswordPageService,
  ) {}

  ngOnInit() {
    this.resetPasswordForm = this.fb.group({
      password: [
        '',
        [Validators.required, Validators.pattern(PASSWORD_PATTERN)],
      ],
    });
    this.route.queryParams.pipe(untilDestroyed(this)).subscribe((params) => {
      this.userId = params['userId'];
      this.token = params['token'];
    });
  }

  getFormControl(name: string) {
    return this.resetPasswordForm.get(name);
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const resetPasswordDto: ResetPasswordDto = {
        userId: this.userId,
        token: this.token,
        newPassword: this.resetPasswordForm.value.password,
      };
      this.resetPasswordPageService.resetPassword(resetPasswordDto);
    }
  }
}
