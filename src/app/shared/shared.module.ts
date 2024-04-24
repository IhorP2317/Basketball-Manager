import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
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
import { PlayerImageSrcPipe } from './pipes/player-image-src.pipe';
import { CreateAndEditPlayerComponent } from './components/create-and-edit-player/create-and-edit-player.component';
import { MatCard, MatCardContent, MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { CreateAndEditCoachComponent } from './components/create-and-edit-coach/create-and-edit-coach.component';
import { CoachImageSrcPipe } from './pipes/coach-image-src.pipe';
import { CreateAndEditUserComponent } from './components/create-and-edit-user/create-and-edit-user.component';
import { MatchTimePipe } from './pipes/match-time.pipe';
import { MatchTeamImageSrcPipe } from './pipes/match-team-image-src.pipe';
import { ExperienceTimePipe } from './pipes/experience-time.pipe';
import { AwardImageSrcPipe } from './pipes/award-image-src.pipe';
import { CreateAwardComponent } from './components/create-award/create-award.component';
import { MatCheckbox } from '@angular/material/checkbox';

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
    PlayerImageSrcPipe,
    CreateAndEditPlayerComponent,
    CreateAndEditCoachComponent,
    CoachImageSrcPipe,
    CreateAndEditUserComponent,
    MatchTimePipe,
    MatchTeamImageSrcPipe,
    ExperienceTimePipe,
    AwardImageSrcPipe,
    CreateAwardComponent,
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
    MatSelectCountryModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    MatCardContent,
    MatCard,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltip,
    MatCheckbox,
    NgOptimizedImage,
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
    PlayerImageSrcPipe,
    CreateAndEditPlayerComponent,
    MatCardModule,
    ReactiveFormsModule,
    CreateAndEditCoachComponent,
    CoachImageSrcPipe,
    CreateAndEditUserComponent,
    MatchTimePipe,
    MatchTeamImageSrcPipe,
    ExperienceTimePipe,
    AwardImageSrcPipe,
    CreateAwardComponent,
  ],
})
export class SharedModule {}
