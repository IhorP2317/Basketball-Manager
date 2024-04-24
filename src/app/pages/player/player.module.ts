import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from './player.component';
import { RouterModule } from '@angular/router';
import { PlayerAwardsListComponent } from './components/player-awards-list/player-awards-list.component';
import { PlayerExperiencesListComponent } from './components/player-experiences-list/player-experiences-list.component';
import { CreateAndEditPlayerExperienceComponent } from './components/create-and-edit-player-experience/create-and-edit-player-experience.component';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../../shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { BaseChartDirective } from 'ng2-charts';
import { TotalAnnualStatisticYearPipe } from './pipes/total-annual-statistic-year.pipe';

@NgModule({
  declarations: [
    PlayerComponent,
    PlayerAwardsListComponent,
    PlayerExperiencesListComponent,
    CreateAndEditPlayerExperienceComponent,
    PlayerExperiencesListComponent,
    TotalAnnualStatisticYearPipe,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: PlayerComponent }]),
    MatCardModule,
    SharedModule,
    MatExpansionModule,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatTooltip,
    MatButton,
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerToggle,
    MatEndDate,
    MatError,
    MatLabel,
    MatOption,
    MatSelect,
    MatStartDate,
    MatSuffix,
    MatCheckbox,
    BaseChartDirective,
  ],
})
export class PlayerModule {}
