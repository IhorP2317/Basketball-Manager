import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found.component';
import { RouterLink, RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: NotFoundComponent }]),
    RouterLink,
    MatIcon,
  ],
})
export class NotFoundModule {}
