import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsComponent } from './teams.component';
import { RouterModule } from '@angular/router';

import { TeamItemComponent } from './components/team-item/team-item.component';
import { SharedModule } from '../../shared/shared.module';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CreateAndEditTeamComponent } from './components/create-and-edit-team/create-and-edit-team.component';
import { MatDateRangeInput } from '@angular/material/datepicker';

@NgModule({
  declarations: [TeamsComponent, TeamItemComponent, CreateAndEditTeamComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: TeamsComponent }]),
    SharedModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    MatFormField,
    MatInput,
    FormsModule,
    MatButton,
    MatDateRangeInput,
    MatLabel,
    MatError,
  ],
})
export class TeamsModule {}
