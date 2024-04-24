import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatchesComponent } from './matches.component';
import { RouterModule } from '@angular/router';
import { MatchesListComponent } from './components/matches-list/matches-list.component';
import { MatSelectModule } from '@angular/material/select';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatchItemComponent } from './components/match-item/match-item.component';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { SharedModule } from '../../shared/shared.module';
import { MonthNamePipe } from './pipes/month-name.pipe';
import { MatchScorePipe } from './pipes/match-score.pipe';
import { FilterMatchesPipe } from './pipes/filter-matches.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateAndEditMatchComponent } from './components/create-and-edit-match/create-and-edit-match.component';
import { MatDateRangeInput } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    MatchesComponent,
    MatchesListComponent,
    MatchItemComponent,
    MonthNamePipe,
    MatchScorePipe,
    FilterMatchesPipe,
    CreateAndEditMatchComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: MatchesComponent }]),
    MatSelectModule,
    MatFormFieldModule,
    MatIcon,
    MatIconButton,
    MatButton,
    MatTableModule,
    NgOptimizedImage,
    MatTooltip,
    SharedModule,
    FormsModule,
    MatDateRangeInput,
    ReactiveFormsModule,
    MatError,
    MatInputModule,
  ],
})
export class MatchesModule {}
