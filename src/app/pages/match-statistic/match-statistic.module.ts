import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchStatisticComponent } from './match-statistic.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '../../shared/shared.module';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BaseChartDirective } from 'ng2-charts';
import { MatDateRangeInput } from '@angular/material/datepicker';

@NgModule({
  declarations: [MatchStatisticComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: MatchStatisticComponent }]),
    MatCardModule,
    SharedModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    BaseChartDirective,
    MatButton,
    MatDateRangeInput,
  ],
})
export class MatchStatisticModule {}
