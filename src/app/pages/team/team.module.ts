import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamComponent } from './team.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TeamPlayerItemComponent } from './components/team-player-item/team-player-item.component';
import { TeamCoachItemComponent } from './components/team-coach-item/team-coach-item.component';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    TeamComponent,
    TeamPlayerItemComponent,
    TeamCoachItemComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: TeamComponent }]),
    SharedModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
  ],
})
export class TeamModule {}
