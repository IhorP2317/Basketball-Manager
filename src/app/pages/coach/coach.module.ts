import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoachComponent } from './coach.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../../shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { CoachExperiencesListComponent } from './components/coach-experiences-list/coach-experiences-list.component';
import { CoachAwardsListComponent } from './components/coach-awards-list/coach-awards-list.component';
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
import { CreateAndEditCoachExperienceComponent } from './components/create-and-edit-coach-experience/create-and-edit-coach-experience.component';
import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';

@NgModule({
  declarations: [
    CoachComponent,
    CoachExperiencesListComponent,
    CoachAwardsListComponent,
    CreateAndEditCoachExperienceComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CoachComponent,
      },
    ]),
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
  ],
})
export class CoachModule {}
