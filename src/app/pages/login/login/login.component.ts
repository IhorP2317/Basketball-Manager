import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserLoginDto} from "../../../core/interfaces/user/user-login.dto";
import {PASSWORD_PATTERN} from "../../../shared/constants/auth.constant";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit  {
  errorMessage: string | null = null;
  hidePassword: boolean = true;
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]]
    });
  }

  getFormControl(name: string) {
    return this.loginForm.get(name);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const userLoginDto: UserLoginDto = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }

    }
  }

}
