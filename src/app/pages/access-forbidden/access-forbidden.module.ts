import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessForbiddenComponent } from './access-forbidden.component';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterModule } from '@angular/router';

@NgModule({
  declarations: [AccessForbiddenComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: AccessForbiddenComponent,
      },
    ]),
    MatIcon,
    RouterLink,
  ],
})
export class AccessForbiddenModule {}
