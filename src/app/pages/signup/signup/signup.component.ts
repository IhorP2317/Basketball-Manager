import {Component, OnInit} from '@angular/core';
import {UserSignupDto} from "../../../core/interfaces/user/user-signup.dto";
import {passwordsMatchValidator} from "../../../shared/validators/form-validators";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {NAME_PATTERN, PASSWORD_PATTERN} from "../../../shared/constants/auth.constant";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{
  errorMessage: string | null = null;
  hidePassword: boolean = true;
  signUpForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
      lastName: ['', [Validators.required, Validators.pattern(NAME_PATTERN)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,
        Validators.pattern(PASSWORD_PATTERN),
        passwordsMatchValidator('confirmPassword', true)]],
      confirmPassword: ['', [Validators.required, passwordsMatchValidator('password')]]
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
      }

    }
  }
}



