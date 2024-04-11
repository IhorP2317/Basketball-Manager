import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordDto } from '../../core/interfaces/password/forgot-password.dto';
import { ForgotPasswordPageService } from './services/forgot-password.page.service';
import { CurrentUserService } from '../../shared/services/current-user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  providers: [ForgotPasswordPageService],
})
export class ForgotPasswordComponent implements OnInit {
  errorMessage: string | null = null;
  forgotPasswordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private forgotPasswordPageService: ForgotPasswordPageService,
    private currentUserService: CurrentUserService,
  ) {}

  ngOnInit() {
    this.currentUserService.removeCurrentUser();
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  getFormControl(name: string) {
    return this.forgotPasswordForm.get(name);
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: this.forgotPasswordForm.value.email,
      };
      this.forgotPasswordPageService.forgotPassword(forgotPasswordDto);
    }
  }
}
