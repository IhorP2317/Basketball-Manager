import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticListComponent } from './statistic-list.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { SharedModule } from '../../shared/shared.module';
import { CreateAndEditStatisticComponent } from './components/create-and-update-statistic/create-and-edit-statistic.component';
import { MatDateRangeInput } from '@angular/material/datepicker';

@NgModule({
  declarations: [StatisticListComponent, CreateAndEditStatisticComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: StatisticListComponent }]),
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    SharedModule,
    MatButton,
    MatDateRangeInput,
  ],
})
export class StatisticListModule {}
