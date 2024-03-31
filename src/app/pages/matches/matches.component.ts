import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { PagedListConfiguration } from '../../core/interfaces/paged-list/paged-list-configuration.dto';
import { MatchesPageService } from './services/matches.page.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../core/interfaces/dialog/dialog-data';
import { ConfirmationDialogComponent } from '../../shared/components/dialog/confirmation-dialog.component';

@UntilDestroy()
@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss',
  providers: [MatchesPageService],
})
export class MatchesComponent implements OnInit {
  matchesPagedList = this.matchesPageService.pagedListMatches$.pipe(
    (pagedListMatches) => pagedListMatches,
  );

  filters = this.matchesPageService.filters$.pipe((filters) => filters);
  selectedYear = moment().year();
  selectedTeam = 'All teams';
  selectYears = this.matchesPageService.yearsFilters$.pipe((years) => years);
  selectTeams = this.matchesPageService.teams$.pipe((teams) => teams);
  constructor(
    private matchesPageService: MatchesPageService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.subscribeToFilterChanges();
  }
  private subscribeToFilterChanges() {
    this.matchesPageService.filters$
      .pipe(untilDestroyed(this))
      .subscribe((filters) => {
        if (filters.year !== this.selectedYear) {
          this.selectedYear = filters.year!;
        }
      });
  }

  onDeleteMatchClicked(matchId: string): void {
    const dialogData: DialogData = {
      title: 'Confirm Action',
      message: 'Are you sure you want to delete this match?',
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.matchesPageService.deleteMatch(matchId);
      }
    });
  }
  onSelectYearChange() {
    this.matchesPageService.setSelectedYear(this.selectedYear);
  }
  onSelectedTeamChange() {
    if(this.selectedTeam === 'All teams') {
      this.matchesPageService.setSelectedTeam(null);
    } else {
      this.matchesPageService.setSelectedTeam(this.selectedTeam);
    }

  }
  onPreviousMonthClicked() {
    this.matchesPageService.setPreviousMonth();
  }

  onNextMonthClicked() {
    this.matchesPageService.setNextMonth();
  }

  onPageChangedEvent(pagingConfiguration: PagedListConfiguration) {
    this.matchesPageService.changePagedListSettings(pagingConfiguration);
  }
}
