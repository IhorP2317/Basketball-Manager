import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserLoginDto } from '../interfaces/user/user-login.dto';
import { UserLogin } from '../interfaces/user/user-login.model';
import { UserSignupDto } from '../interfaces/user/user-signup.dto';
import { User } from '../interfaces/user/user.model';
import { ResetPasswordDto } from '../interfaces/password/reset-password.dto';
import { Observable, throwError } from 'rxjs';
import { Token } from '../interfaces/token/token';
import { ForgotPasswordDto } from '../interfaces/password/forgot-password.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthEndpointService {
  constructor(
    private http: HttpClient,
    @Inject('securityUrl') private securityUrl: string,
    @Inject('apiUrl') private apiUrl: string,
  ) {}

  login(userLoginDto: UserLoginDto) {
    return this.http.post<UserLogin>(`${this.securityUrl}/login`, userLoginDto);
  }

  signUp(userSignUpDto: UserSignupDto) {
    return this.http.post<User>(`${this.apiUrl}/users/register`, userSignUpDto);
  }

  registerAdmin(userSignUpDto: UserSignupDto) {
    return this.http.post<User>(
      `${this.apiUrl}/users/register/Admin`,
      userSignUpDto,
    );
  }

  refreshAccessToken(token: Token | null): Observable<Token> {
    if (!token) {
      return throwError(() => new Error('Bearer token not found!'));
    }
    console.log('refreshing token');
    return this.http.post<Token>(`${this.securityUrl}/refresh`, token);
  }

  confirmEmail(userId: string, token: string) {
    let params = new HttpParams();
    params = params.append('userId', userId);
    params = params.append('token', token);
    return this.http.get<void>(`${this.apiUrl}/users/email/confirm`, {
      params,
    });
  }

  forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    return this.http.post<void>(
      `${this.securityUrl}/password/forgot`,
      forgotPasswordDto,
    );
  }

  resetPassword(resetPasswordDto: ResetPasswordDto) {
    return this.http.post<void>(
      `${this.securityUrl}/password/reset`,
      resetPasswordDto,
    );
  }
}
