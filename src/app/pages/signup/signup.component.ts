import { Component, OnInit } from '@angular/core';
import { UserSignupDto } from '../../core/interfaces/user/user-signup.dto';
import { passwordsMatchValidator } from '../../shared/validators/form-validators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NAME_PATTERN,
  PASSWORD_PATTERN,
} from '../../shared/constants/form.constant';
import { SignupPageService } from './services/signup.page.service';
import { CurrentUserService } from '../../shared/services/current-user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  providers: [SignupPageService],
})
export class SignupComponent implements OnInit {
  errorMessage: string | null = null;
  hidePassword: boolean = true;
  signUpForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private signupPageService: SignupPageService,
    private currentUserService: CurrentUserService,
  ) {}

  ngOnInit() {
    this.currentUserService.removeCurrentUser();
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
      lastName: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(PASSWORD_PATTERN),
          passwordsMatchValidator('confirmPassword', true),
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, passwordsMatchValidator('password')],
      ],
    });
  }

  getFormControl(name: string) {
    return this.signUpForm.get(name);
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const userSignUpDto: UserSignupDto = {
        firstName: this.signUpForm.value.firstName,
        lastName: this.signUpForm.value.lastName,
        email: this.signUpForm.value.email,
        password: this.signUpForm.value.password,
      };
      this.signupPageService.signUp(userSignUpDto);
    }
  }
}
