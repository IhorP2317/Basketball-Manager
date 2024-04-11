import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailConfirmationComponent } from './email-confirmation.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [EmailConfirmationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: EmailConfirmationComponent },
    ]),
  ],
})
export class EmailConfirmationModule {}
