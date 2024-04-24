import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { PagedListConfiguration } from '../../core/interfaces/paged-list/paged-list-configuration.dto';
import { MatchesPageService } from './services/matches.page.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../core/interfaces/dialog/dialog-data';
import { ConfirmationDialogComponent } from '../../shared/components/dialog/confirmation-dialog.component';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { MatchRequestDto } from '../../core/interfaces/match/match-request.dto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatchActionsForm } from '../../core/interfaces/forms/match/match-actions-form';
import {
  dateRangeValidator,
  dateValidator,
  distinctTeamsValidator,
} from '../../shared/validators/form-validators';
import { Match } from '../../core/interfaces/match/match.model';
import { MatchUpdateDto } from '../../core/interfaces/match/match-update.dto';

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
  matchActionsForm!: FormGroup<MatchActionsForm>;
  filters$ = this.matchesPageService.filters$;
  selectedYear = moment().year();
  selectedTeam = 'All teams';
  selectYears$ = this.matchesPageService.yearsFilters$;
  selectTeams$ = this.matchesPageService.teams$;

  constructor(
    private matchesPageService: MatchesPageService,
    private currentUserService: CurrentUserService,
    public dialog: MatDialog,
  ) {}

  initializeMatchForm() {
    this.matchActionsForm = new FormGroup<MatchActionsForm>(
      {
        id: new FormControl(''),
        location: new FormControl('', Validators.required),
        startTime: new FormControl(null, [
          Validators.required,
          dateValidator(
            moment()
              .year(1891)
              .month('December')
              .date(1)
              .startOf('day')
              .toDate(),
            'min',
          ),
        ]),
        endTime: new FormControl(null),
        homeTeam: new FormControl(null, Validators.required),
        awayTeam: new FormControl(null, Validators.required),
        sectionCount: new FormControl(null, [
          Validators.required,
          Validators.min(1),
        ]),
        rowCount: new FormControl(null, [
          Validators.required,
          Validators.min(1),
        ]),
        seatCount: new FormControl(null, [
          Validators.required,
          Validators.min(1),
        ]),
        status: new FormControl('', Validators.required),
      },
      { validators: [dateRangeValidator, distinctTeamsValidator] },
    );
  }

  fillCreateMatchForm() {
    this.matchActionsForm.reset();
    this.matchActionsForm.controls.id.setValue('');
    this.matchActionsForm.controls.location.setValue('');
    this.matchActionsForm.controls.startTime.setValue(
      moment().format('YYYY-MM-DDTHH:mm'),
    );
    this.matchActionsForm.controls.endTime.setValue(null);
    this.matchActionsForm.controls.homeTeam.setValue(null);
    this.matchActionsForm.controls.awayTeam.setValue(null);
    this.matchActionsForm.controls.sectionCount.setValue(1);
    this.matchActionsForm.controls.rowCount.setValue(1);
    this.matchActionsForm.controls.seatCount.setValue(1);
    this.matchActionsForm.controls.status.setValue('Scheduled');
  }

  fillUpdateMatchForm(match: Match) {
    this.matchActionsForm.reset();
    this.matchActionsForm.controls.id.setValue(match.id);
    this.matchActionsForm.controls.location.setValue(match.location);
    this.matchActionsForm.controls.startTime.setValue(
      match.startTime
        ? moment(match.startTime).format('YYYY-MM-DDTHH:mm')
        : null,
    );
    this.matchActionsForm.controls.endTime.setValue(
      match.endTime ? moment(match.endTime).format('YYYY-MM-DDTHH:mm') : null,
    );

    this.selectTeams$.pipe(take(1), untilDestroyed(this)).subscribe((teams) => {
      const homeTeam = teams?.find((team) => team.id === match.homeTeamId);
      const awayTeam = teams?.find((team) => team.id === match.awayTeamId);

      this.matchActionsForm.controls.homeTeam.setValue(
        homeTeam ? homeTeam : null,
      );
      this.matchActionsForm.controls.awayTeam.setValue(
        awayTeam ? awayTeam : null,
      );
    });

    this.matchActionsForm.controls.sectionCount.setValue(match.sectionCount);
    this.matchActionsForm.controls.rowCount.setValue(match.rowCount);
    this.matchActionsForm.controls.seatCount.setValue(match.seatCount);
    this.matchActionsForm.controls.status.setValue(match.status);
  }

  ngOnInit() {
    this.subscribeToFilterChanges();
    this.initializeMatchForm();
  }

  isAdminUser() {
    return this.currentUserService.isAdminOrSuperAdmin();
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
    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result),
        untilDestroyed(this),
      )
      .subscribe(() => this.matchesPageService.deleteMatch(matchId));
  }

  onSelectYearChange() {
    this.matchesPageService.setSelectedYear(this.selectedYear);
  }

  onSelectedTeamChange() {
    if (this.selectedTeam === 'All teams') {
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

  handleUpdateMatch(eventData: { id: string; matchDto: MatchUpdateDto }) {
    this.matchesPageService.updateMatch(eventData.id, eventData.matchDto);
  }

  handleCreateMatch(eventData: { matchDto: MatchRequestDto }) {
    this.matchesPageService.createMatch(eventData.matchDto);
  }

  onPageChangedEvent(pagingConfiguration: PagedListConfiguration) {
    this.matchesPageService.changePagedListSettings(pagingConfiguration);
  }
}
