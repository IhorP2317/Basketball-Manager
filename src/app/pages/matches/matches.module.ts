import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatchesComponent } from './matches.component';
import { RouterModule } from '@angular/router';
import { MatchesListComponent } from './components/matches-list/matches-list.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatchItemComponent } from './components/match-item/match-item.component';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { MonthNamePipe } from './pipes/month-name.pipe';
import { MatchTimePipe } from './pipes/match-time.pipe';
import { MatchScorePipe } from './pipes/match-score.pipe';
import { FilterMatchesPipe } from './pipes/filter-matches.pipe';
import { FormsModule } from '@angular/forms';
import { MatchTeamImageSrcPipe } from './pipes/match-team-image-src.pipe';

@NgModule({
  declarations: [
    MatchesComponent,
    MatchesListComponent,
    MatchItemComponent,
    MonthNamePipe,
    MatchTimePipe,
    MatchScorePipe,
    FilterMatchesPipe,
    MatchTeamImageSrcPipe,
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
    SharedComponentsModule,
    FormsModule,
  ],
})
export class MatchesModule {}
