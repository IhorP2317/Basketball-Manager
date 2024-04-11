import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { HttpClientModule } from '@angular/common/http';
import { NavigationTapGroupComponent } from './components/navigation-tap-group/navigation-tap-group.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from './components/dialog/confirmation-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PopUpComponent } from './components/pop-up/pop-up.component';
import { CurrentImageSrcPipe } from './pipes/current-user-img-src.pipe';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { PopUpContentDirective } from './directives/pop-up-content.directive';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ImageCropperComponent } from './components/image-cropper/image-cropper.component';
import { TeamImageSrcPipe } from './pipes/team-image-src.pipe';
import { StaffImageSrcPipe } from './pipes/staff-image-src.pipe';

@NgModule({
  declarations: [
    AppHeaderComponent,
    NavigationTapGroupComponent,
    PaginatorComponent,
    ConfirmationDialogComponent,
    PopUpComponent,
    CurrentImageSrcPipe,
    SpinnerComponent,
    PopUpContentDirective,
    AvatarComponent,
    ImageCropperComponent,
    TeamImageSrcPipe,
    StaffImageSrcPipe,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    RouterOutlet,
    MatPaginator,
    MatDialogModule,
  ],
  exports: [
    AppHeaderComponent,
    NavigationTapGroupComponent,
    PaginatorComponent,
    SpinnerComponent,
    PopUpComponent,
    PopUpContentDirective,
    AvatarComponent,
    TeamImageSrcPipe,
    StaffImageSrcPipe,
  ],
})
export class SharedModule {}
