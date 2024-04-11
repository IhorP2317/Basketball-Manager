import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserItemComponent } from './components/user-item/user-item.component';
import { MatTooltip } from '@angular/material/tooltip';
import { SharedModule } from '../../shared/shared.module';
import { UserModificationTimePipe } from './pipes/user-modification-time.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { UserImageSrcPipe } from './pipes/user-image-src.pipe';

@NgModule({
  declarations: [
    UsersComponent,
    UserItemComponent,
    UserModificationTimePipe,
    UserImageSrcPipe,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: UsersComponent }]),
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconButton,
    MatTooltip,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class UsersModule {}
