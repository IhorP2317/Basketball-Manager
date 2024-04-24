import { Component, OnInit, ViewChild } from '@angular/core';
import { StatisticListPageService } from './services/statistic-list.page.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatchDetail } from '../../core/interfaces/match/match-detail.model';
import {
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PagedListConfiguration } from '../../core/interfaces/paged-list/paged-list-configuration.dto';
import { Statistic } from '../../core/interfaces/statistic/statistic.model';
import { DialogData } from '../../core/interfaces/dialog/dialog-data';
import { ConfirmationDialogComponent } from '../../shared/components/dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { StatisticDto } from '../../core/interfaces/statistic/statistic.dto';
import { StatisticActionsForm } from '../../core/interfaces/forms/statistic/statistic-actions-form';
import { timeLimitValidator } from '../../shared/validators/form-validators';
import { PlayerExperienceDetail } from '../../core/interfaces/staff-experience/player-experience-detail.model';
import moment from 'moment/moment';
import { AlertService } from '../../shared/services/alert.service';
import { PopUpComponent } from '../../shared/components/pop-up/pop-up.component';

@UntilDestroy()
@Component({
  selector: 'app-statistic-list',
  templateUrl: './statistic-list.component.html',
  styleUrl: './statistic-list.component.scss',
  providers: [StatisticListPageService],
})
export class StatisticListComponent implements OnInit {
  @ViewChild('createStatisticDialog') createStatisticDialog!: PopUpComponent;
  @ViewChild('editStatisticDialog') editStatisticDialog!: PopUpComponent;
  statisticFiltersForm!: FormGroup;
  statisticActionsForm!: FormGroup<StatisticActionsForm>;
  matchPlayerExperiences!: PlayerExperienceDetail[];
  match!: MatchDetail;
  statistics$ = this.statisticListPageService.matchStatistics$;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private statisticListPageService: StatisticListPageService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private alertService: AlertService,
  ) {
    this.statisticFiltersForm = this.fb.group({
      team: ['All teams'],
      accumulateCheckBox: [false],
      timeUnit: [1],
    });
  }

  dialogOpen(action: 'Create' | 'Edit', statistic?: Statistic) {
    if (this.matchPlayerExperiences.length < 1) {
      this.alertService.error(
        'Please create new player experience in order to manage statistic!',
      );
    } else {
      if (action === 'Create') {
        this.fillCreateStatisticForm();
        this.createStatisticDialog.open();
      } else if (action === 'Edit') {
        if (statistic) {
          this.fillUpdateStatisticForm(statistic);
          this.editStatisticDialog.open();
        }
      }
    }
  }

  ngOnInit() {
    this.initializeStatisticActionForm();
    this.activatedRoute.params
      .pipe(
        map((params) => params['id']),
        switchMap((id) => {
          if (!id) {
            this.router.navigate(['/not-found']);
            return EMPTY;
          }
          return this.statisticListPageService.loadMatch$(id);
        }),
        tap((matchDetail) => {
          if (!matchDetail) {
            this.router.navigate(['/not-found']);
            return;
          }
          this.match = matchDetail;
          this.statisticListPageService.setCurrentMatchId(this.match.id);
        }),
        switchMap((matchDetail) =>
          this.statisticListPageService.getAllPlayerExperiencesInMatch$({
            homeTeamId: this.match.homeTeamId,
            awayTeamId: this.match.awayTeamId,
            matchStartTime: moment(this.match.startTime).format(
              'YYYY-MM-DD HH:mm:ss',
            ),
          }),
        ),
        tap((playerExperiences) => {
          this.matchPlayerExperiences = playerExperiences;
          console.log(this.matchPlayerExperiences);
        }),
        untilDestroyed(this),
      )
      .subscribe();
    this.onMatchStatisticFiltersChange();
  }

  initializeStatisticActionForm() {
    this.statisticActionsForm = new FormGroup<StatisticActionsForm>(
      {
        matchId: new FormControl('', Validators.required),
        playerExperience: new FormControl(null, Validators.required),
        timeUnit: new FormControl(1, [Validators.required, Validators.min(1)]),
        onePointShotHitCount: new FormControl(0, [
          Validators.required,
          Validators.min(0),
        ]),
        onePointShotMissCount: new FormControl(0, [
          Validators.required,
          Validators.min(0),
        ]),
        twoPointShotHitCount: new FormControl(0, [
          Validators.required,
          Validators.min(0),
        ]),
        twoPointShotMissCount: new FormControl(0, [
          Validators.required,
          Validators.min(0),
        ]),
        threePointShotHitCount: new FormControl(0, [
          Validators.required,
          Validators.min(0),
        ]),
        threePointShotMissCount: new FormControl(0, [
          Validators.required,
          Validators.min(0),
        ]),
        assistCount: new FormControl(0, [
          Validators.required,
          Validators.min(0),
        ]),
        offensiveReboundCount: new FormControl(0, [
          Validators.required,
          Validators.min(0),
        ]),
        defensiveReboundCount: new FormControl(0, [
          Validators.required,
          Validators.min(0),
        ]),
        stealCount: new FormControl(0, [
          Validators.required,
          Validators.min(0),
        ]),
        blockCount: new FormControl(0, [
          Validators.required,
          Validators.min(0),
        ]),
        turnoverCount: new FormControl(0, [
          Validators.required,
          Validators.min(0),
        ]),
        minutes: new FormControl(0, [
          Validators.required,
          Validators.min(0),
          Validators.max(12),
        ]),
        seconds: new FormControl(0, [
          Validators.required,
          Validators.min(0),
          Validators.max(59),
        ]),
      },
      { validators: timeLimitValidator },
    );
  }

  fillCreateStatisticForm() {
    this.statisticActionsForm.reset();
    this.statisticActionsForm.controls.matchId.setValue(this.match.id);
    this.statisticActionsForm.controls.playerExperience.setValue(null);
    this.statisticActionsForm.controls.timeUnit.setValue(1);
    this.statisticActionsForm.controls.onePointShotHitCount.setValue(0);
    this.statisticActionsForm.controls.onePointShotMissCount.setValue(0);
    this.statisticActionsForm.controls.twoPointShotHitCount.setValue(0);
    this.statisticActionsForm.controls.twoPointShotMissCount.setValue(0);
    this.statisticActionsForm.controls.threePointShotHitCount.setValue(0);
    this.statisticActionsForm.controls.threePointShotMissCount.setValue(0);
    this.statisticActionsForm.controls.assistCount.setValue(0);
    this.statisticActionsForm.controls.offensiveReboundCount.setValue(0);
    this.statisticActionsForm.controls.defensiveReboundCount.setValue(0);
    this.statisticActionsForm.controls.stealCount.setValue(0);
    this.statisticActionsForm.controls.blockCount.setValue(0);
    this.statisticActionsForm.controls.turnoverCount.setValue(0);
    this.statisticActionsForm.controls.minutes.setValue(0);
    this.statisticActionsForm.controls.seconds.setValue(0);
  }

  fillUpdateStatisticForm(statistic: Statistic) {
    this.statisticActionsForm.reset();
    this.statisticActionsForm.controls.matchId.setValue(this.match.id);
    const matchingExperience = this.matchPlayerExperiences.find(
      (experience) => experience.id === statistic.playerExperienceId,
    );
    this.statisticActionsForm.controls.playerExperience.setValue(
      matchingExperience!,
    );
    this.statisticActionsForm.controls.timeUnit.setValue(statistic.timeUnit);
    this.statisticActionsForm.controls.onePointShotHitCount.setValue(
      statistic.onePointShotHitCount,
    );
    this.statisticActionsForm.controls.onePointShotMissCount.setValue(
      statistic.onePointShotMissCount,
    );
    this.statisticActionsForm.controls.twoPointShotHitCount.setValue(
      statistic.twoPointShotHitCount,
    );
    this.statisticActionsForm.controls.twoPointShotMissCount.setValue(
      statistic.twoPointShotMissCount,
    );
    this.statisticActionsForm.controls.threePointShotHitCount.setValue(
      statistic.threePointShotHitCount,
    );
    this.statisticActionsForm.controls.threePointShotMissCount.setValue(
      statistic.threePointShotMissCount,
    );
    this.statisticActionsForm.controls.assistCount.setValue(
      statistic.assistCount,
    );
    this.statisticActionsForm.controls.offensiveReboundCount.setValue(
      statistic.offensiveReboundCount,
    );
    this.statisticActionsForm.controls.defensiveReboundCount.setValue(
      statistic.defensiveReboundCount,
    );
    this.statisticActionsForm.controls.stealCount.setValue(
      statistic.stealCount,
    );
    this.statisticActionsForm.controls.blockCount.setValue(
      statistic.blockCount,
    );
    this.statisticActionsForm.controls.turnoverCount.setValue(
      statistic.turnoverCount,
    );
    if (statistic.courtTime) {
      const timeParts = statistic.courtTime.split(':');
      if (timeParts.length === 3) {
        const minutes = parseInt(timeParts[1], 10);
        const seconds = parseInt(timeParts[2], 10);

        this.statisticActionsForm.controls.minutes.setValue(minutes);
        this.statisticActionsForm.controls.seconds.setValue(seconds);
      }
    }
  }

  onMatchStatisticFiltersChange() {
    const combinedUpdates$ = this.statisticFiltersForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((values) => ({
          timeUnit: values.timeUnit,
          teamId: values.team === 'All teams' ? null : values.team.id,
        })),
        tap((filters) => this.statisticListPageService.changeFilters(filters)),
        untilDestroyed(this),
      )
      .subscribe();
  }

  onPageChangedEvent(pagingConfiguration: PagedListConfiguration) {
    this.statisticListPageService.changePagingSettings(pagingConfiguration);
  }

  onDeleteStatisticClicked(statistic: Statistic) {
    const dialogData: DialogData = {
      title: 'Confirm Action',
      message: `Are you sure you want to delete this statistic?`,
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
      .subscribe((result) => {
        this.statisticListPageService.deleteStatistic(
          statistic.matchId,
          statistic.playerExperienceId,
          statistic.timeUnit,
        );
      });
  }

  handleCreateStatistic(statistic: StatisticDto) {
    this.statisticListPageService.createStatistic(statistic);
  }

  handleUpdateStatistic(statistic: StatisticDto) {
    this.statisticListPageService.updateStatistic(statistic);
  }
}
