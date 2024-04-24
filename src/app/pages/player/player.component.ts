import { Component, OnInit, ViewChild } from '@angular/core';
import { PlayerDetail } from '../../core/interfaces/player/player-detail.model';
import { PopUpComponent } from '../../shared/components/pop-up/pop-up.component';
import { PlayerService } from '../../shared/services/player.service';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from '../../shared/services/alert.service';
import { PlayerPageService } from './services/player.page.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { StaffExperienceForm } from '../../core/interfaces/forms/staff-experience/staff-experience-form';
import { AwardActionsForm } from '../../core/interfaces/forms/award/award-actions-form';
import {
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  filter,
  map,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NAME_PATTERN } from '../../shared/constants/form.constant';
import {
  dateValidator,
  dateWithinExperienceRangeValidator,
} from '../../shared/validators/form-validators';
import moment from 'moment';
import { PlayerExperienceDetail } from '../../core/interfaces/staff-experience/player-experience-detail.model';
import { StaffExperienceUpdateDto } from '../../core/interfaces/staff-experience/staff-experience-update.dto';
import { DialogData } from '../../core/interfaces/dialog/dialog-data';
import { ConfirmationDialogComponent } from '../../shared/components/dialog/confirmation-dialog.component';
import { AwardRequestDto } from '../../core/interfaces/awards/award-request.dto';
import { StaffExperienceDto } from '../../core/interfaces/staff-experience/staff-experience.dto';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TotalAnnuallyPlayerStatistic } from '../../core/interfaces/statistic/total-annually-player-statistic.model';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { TOTAL_PLAYER_STATISTIC_OPTIONS } from '../../shared/constants/selectOption.constant';
import { NumericKeysOfPlayerTotalAnnualStatistic } from '../../core/types/numeric-key-player-total-annual-statistic';

@UntilDestroy()
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss',
  providers: [PlayerPageService],
})
export class PlayerComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild('createAwardDialog') createAwardDialog!: PopUpComponent;
  public playerStatisticChartPlugins = [DatalabelsPlugin];
  player!: PlayerDetail;
  playerExperienceActionsForm!: FormGroup<StaffExperienceForm>;
  awardActionsForm!: FormGroup<AwardActionsForm>;
  selectTeams$ = this.playerService.teams$;
  selectYears$ = this.playerPageService.yearsFilters$;
  playerTotalStatistic$ = this.playerPageService.totalAnnuallyPlayerStatistics$;
  playerStatisticFilters$ = this.playerPageService.filters$;
  playerStatisticFiltersForm!: FormGroup;
  hasYear: boolean = false;
  totalPlayerStatisticOptions = TOTAL_PLAYER_STATISTIC_OPTIONS;
  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Points',
        data: [],
        backgroundColor: ['#2e7d32'],
        hoverBackgroundColor: ['#a5d6a7'],
      },
    ],
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: 14,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        font: {
          size: 14,
        },
      },
    },
  };

  constructor(
    private playerPageService: PlayerPageService,
    private playerService: PlayerService,
    private currentUserService: CurrentUserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private alertService: AlertService,
    private fb: FormBuilder,
  ) {
    this.playerStatisticFiltersForm = this.fb.group({
      year: ['All Time'],
      statisticalOption: ['points'],
    });
  }

  ngOnInit() {
    this.playerStatisticFilters$
      .pipe(untilDestroyed(this))
      .subscribe((filters) => {
        this.hasYear = !!filters.year;
      });

    this.activatedRoute.params
      .pipe(
        map((params) => params['id']),
        switchMap((id) => {
          if (!id) {
            this.router.navigate(['/not-found']);
            return EMPTY;
          }
          return this.playerPageService.loadPlayer$(id);
        }),
        tap((playerDetail) => {
          this.player = playerDetail;
          this.playerPageService.setCurrentPlayerId(this.player.id);
        }),
        untilDestroyed(this),
      )
      .subscribe((playerDetail) => {
        this.initializePlayerExperienceActionsForm();
        this.initializeAwardActionsForm();
      });
    this.onPlayerStatisticFiltersChange();
    this.onStatisticalParameterChange();
  }

  onStatisticalParameterChange() {
    const statisticalOptionControl =
      this.playerStatisticFiltersForm.get('statisticalOption');
    const initialStatisticalOption = statisticalOptionControl
      ? statisticalOptionControl.value || 'points'
      : 'points';
    this.playerStatisticFiltersForm
      .get('statisticalOption')!
      .valueChanges.pipe(
        startWith(initialStatisticalOption),
        map((value) => value as NumericKeysOfPlayerTotalAnnualStatistic),
        untilDestroyed(this),
      )
      .subscribe((selectedOption) => {
        this.updateChartData(selectedOption);
      });
  }

  private updateChartData(
    selectedOption: NumericKeysOfPlayerTotalAnnualStatistic,
  ): void {
    this.playerTotalStatistic$
      .pipe(
        filter(
          (
            playerStatistics,
          ): playerStatistics is TotalAnnuallyPlayerStatistic[] =>
            playerStatistics !== null && playerStatistics !== undefined,
        ),
        map((playerStatistics) => {
          // Filter out invalid years and sort
          const validStatistics = playerStatistics
            .filter((stat) => stat.year !== 0 && stat.year !== -1)
            .sort((a, b) => a.year - b.year);

          const chartLabels = validStatistics.map((stat) =>
            stat.year.toString(),
          );
          const chartDataPoints = validStatistics.map(
            (stat) => +stat[selectedOption].toFixed(2),
          );

          // Update the chart
          this.lineChartData.labels = chartLabels;
          this.lineChartData.datasets[0].data = chartDataPoints;
          this.lineChartData.datasets[0].label =
            TOTAL_PLAYER_STATISTIC_OPTIONS.find(
              (option) => option.key === selectedOption,
            )?.display || 'Statistic';

          if (this.chart) {
            this.chart.update();
          }

          return this.lineChartData;
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }

  onPlayerStatisticFiltersChange() {
    this.playerStatisticFiltersForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((values) => ({
          year: values.year === 'All Time' ? null : values.year,
        })),
        tap((filters) => this.playerPageService.changeFilters(filters)),
        untilDestroyed(this),
      )
      .subscribe();
  }

  initializePlayerExperienceActionsForm() {
    this.playerExperienceActionsForm = new FormGroup<StaffExperienceForm>({
      id: new FormControl(null),
      team: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null, [
        dateValidator(
          moment(this.player.dateOfBirth).add(18, 'year').toDate(),
          'min',
        ),
      ]),
      endDate: new FormControl(null, dateValidator(moment().toDate(), 'max')),
    });
  }

  initializeAwardActionsForm() {
    this.awardActionsForm = new FormGroup<AwardActionsForm>(
      {
        staffExperience: new FormControl(null, [Validators.required]),
        name: new FormControl('', [
          Validators.required,
          Validators.pattern(NAME_PATTERN),
        ]),
        isIndividualAward: new FormControl<boolean>(false, {
          nonNullable: true,
        }),
        date: new FormControl(null, [
          dateValidator(
            moment(this.player.dateOfBirth).add(18, 'year').toDate(),
            'min',
          ),
        ]),
        avatar: new FormControl(null),
      },
      dateWithinExperienceRangeValidator,
    );
  }

  fillCreateAwardForm() {
    this.awardActionsForm.reset();
  }

  dialogOpen() {
    if (this.player.playerExperiences.length < 1) {
      this.alertService.error(
        'Please create new experience in order to create new award!',
      );
    } else {
      this.fillCreateAwardForm();
      this.createAwardDialog.open();
    }
  }

  fillCreatePlayerExperienceForm() {
    this.playerExperienceActionsForm.reset();
    this.playerExperienceActionsForm.controls.team.setValue(null);
    this.playerExperienceActionsForm.controls.startDate.setValue(
      moment(this.player.dateOfBirth).add(18, 'year').toDate(),
    );
    this.playerExperienceActionsForm.controls.endDate.setValue(null);
  }

  fillUpdatePlayerExperienceForm(playerExperience: PlayerExperienceDetail) {
    this.playerExperienceActionsForm.reset();
    this.playerExperienceActionsForm.controls.id.setValue(playerExperience.id);
    this.selectTeams$
      .pipe(
        map((teams) =>
          teams?.find((team) => team.id === playerExperience.teamId),
        ),
        take(1),
        untilDestroyed(this),
      )
      .subscribe((team) => {
        this.playerExperienceActionsForm.controls.team.setValue(
          team ? team : null,
        );
      });
    this.playerExperienceActionsForm.controls.startDate.setValue(
      playerExperience.startDate,
    );
    this.playerExperienceActionsForm.controls.endDate.setValue(
      playerExperience.endDate,
    );
  }

  get isAdminUser() {
    return this.currentUserService.isAdminOrSuperAdmin();
  }

  onError(event: Event) {
    (event.target as HTMLImageElement).src = `assets/images/empty-staff.jpg`;
  }

  handleCreatePlayerExperience(playerExperience: StaffExperienceDto) {
    this.playerPageService
      .createPlayerExperience$(this.player.id, playerExperience)
      .pipe(
        switchMap(() => this.playerPageService.loadPlayer$(this.player.id)),
        untilDestroyed(this),
      )
      .subscribe((player) => (this.player = player));
  }

  handleUpdatePlayerExperience(eventData: {
    playerExperienceId: string;
    playerExperienceUpdateDto: StaffExperienceUpdateDto;
  }) {
    this.playerPageService
      .updatePlayerExperience$(
        eventData.playerExperienceId,
        eventData.playerExperienceUpdateDto,
      )
      .pipe(
        switchMap(() => this.playerPageService.loadPlayer$(this.player.id)),
        untilDestroyed(this),
      )
      .subscribe((player) => (this.player = player));
  }

  onDeletePlayerExperienceClicked(playerExperienceId: string): void {
    const dialogData: DialogData = {
      title: 'Confirm Action',
      message: `Are you sure you want to delete this experience?`,
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() =>
          this.playerPageService.deletePlayerExperience$(playerExperienceId),
        ),
        switchMap(() => this.playerPageService.loadPlayer$(this.player.id)),
        untilDestroyed(this),
      )
      .subscribe((player) => {
        this.player = player;
      });
  }

  onDeletePlayerAwardClicked(awardId: string): void {
    const playerExperience = this.player.playerExperiences.find((experience) =>
      experience.playerAwards.some((award) => award.id === awardId),
    );

    if (!playerExperience) {
      this.alertService.error('Award not found.');
      return;
    }

    const dialogData: DialogData = {
      title: 'Confirm Action',
      message: `Are you sure you want to delete this award from ${this.player.lastName + ' ' + this.player.firstName}?`,
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() =>
          this.playerPageService.deletePlayerAward$(
            playerExperience.id,
            awardId,
          ),
        ),
        switchMap(() => this.playerPageService.loadPlayer$(this.player.id)),
        untilDestroyed(this),
      )
      .subscribe((player) => {
        this.player = player;
      });
  }

  handleCreatePlayerAward(eventData: {
    staffExperienceId: string;
    awardDto: AwardRequestDto;
    awardImage?: File | null | undefined;
  }) {
    this.playerPageService
      .createPlayerAward$(
        eventData.staffExperienceId,
        eventData.awardDto,
        eventData.awardImage,
      )
      .pipe(
        switchMap(() => this.playerPageService.loadPlayer$(this.player.id)),
        untilDestroyed(this),
      )
      .subscribe((player) => (this.player = player));
  }
}
