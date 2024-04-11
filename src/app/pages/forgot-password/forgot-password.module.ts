import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { MatInput } from '@angular/material/input';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ForgotPasswordComponent }]),
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatError,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
  ],
})
export class ForgotPasswordModule {}
