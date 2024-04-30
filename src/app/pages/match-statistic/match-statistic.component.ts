import { Component, OnInit, ViewChild } from '@angular/core';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { saveAs } from 'file-saver';
import { MatchStatisticPageService } from './services/match-statistic.page.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  filter,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchDetail } from '../../core/interfaces/match/match-detail.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChartConfiguration, ChartData } from 'chart.js';

import { PlayerImpactStatisticModel } from '../../core/interfaces/statistic/player-impact-statistic.model';
import { BaseChartDirective } from 'ng2-charts';
import { NumericKeysOfPlayerImpactStatisticModel } from '../../core/types/numeric-key-player-impact-statistic';
import { TotalTeamStatisticModel } from '../../core/interfaces/statistic/total-team-statistic.model';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { STATISTICAL_SHARES } from '../../shared/constants/selectOption.constant';

@UntilDestroy()
@Component({
  selector: 'app-match-statistic',
  templateUrl: './match-statistic.component.html',
  styleUrl: './match-statistic.component.scss',
  providers: [MatchStatisticPageService],
})
export class MatchStatisticComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public matchStatisticChartPlugins = [DatalabelsPlugin];
  match!: MatchDetail;
  matchFiltersForm!: FormGroup;
  matchTeamStatistic$ = this.matchStatisticPageService.matchTeamStatistic$;
  matchPlayerImpactStatistic$ =
    this.matchStatisticPageService.matchPlayerImpactStatistic$;
  matchStatisticFilters$ =
    this.matchStatisticPageService.matchStatisticFilters$;
  totalTeamStatistic$ = this.matchStatisticPageService.totalTeamStatistic$;
  hasTeamId: boolean = false;
  statisticalShares = STATISTICAL_SHARES;

  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  };
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  public barChartOptions: ChartConfiguration['options'] = {
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

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333',
          font: {
            size: 20,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  constructor(
    private currentUserService: CurrentUserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private matchStatisticPageService: MatchStatisticPageService,
    private fb: FormBuilder,
  ) {
    this.matchFiltersForm = this.fb.group({
      team: ['All teams'],
      accumulateCheckBox: [false],
      timeUnit: [1],
      statisticalShare: ['pointsShare'],
    });
  }

  ngOnInit() {
    this.matchStatisticFilters$
      .pipe(untilDestroyed(this))
      .subscribe((filters) => {
        this.hasTeamId = !!filters.teamId;
      });

    // Retrieve the control, and set a default value if it's not found
    const statisticalShareControl =
      this.matchFiltersForm.get('statisticalShare');
    const initialStatisticalShare = statisticalShareControl
      ? statisticalShareControl.value || 'pointsShare'
      : 'pointsShare';

    this.activatedRoute.params
      .pipe(
        map((params) => params['id']),
        switchMap((id) => {
          if (!id) {
            this.router.navigate(['/not-found']);
            return EMPTY;
          }
          return this.matchStatisticPageService.loadMatch$(id);
        }),
        tap((matchDetail) => {
          if (!matchDetail) {
            this.router.navigate(['/not-found']);
            return;
          }
          this.match = matchDetail;
          this.matchStatisticPageService.setCurrentMatchId(this.match.id);
        }),
        switchMap(() =>
          combineLatest([
            this.matchPlayerImpactStatistic$,
            this.totalTeamStatistic$,
            statisticalShareControl
              ? statisticalShareControl.valueChanges.pipe(
                  startWith(initialStatisticalShare),
                )
              : of(initialStatisticalShare),
          ]),
        ),
        untilDestroyed(this),
      )
      .subscribe(
        ([playerImpactStatistics, totalTeamStatistics, statisticalShare]) => {
          if (playerImpactStatistics && statisticalShare) {
            this.updateImpactChartData(
              playerImpactStatistics,
              statisticalShare,
            );
          }
          if (totalTeamStatistics && !this.hasTeamId) {
            this.updateBarChartData(totalTeamStatistics);
          }
        },
      );

    this.onMatchStatisticFiltersChange();
  }

  private updateImpactChartData(
    playerImpactStatistics: PlayerImpactStatisticModel[],
    statisticalShareKey: NumericKeysOfPlayerImpactStatisticModel,
  ) {
    this.pieChartData.labels = playerImpactStatistics.map(
      (stat) => stat.fullName,
    );
    this.pieChartData.datasets[0].data = playerImpactStatistics.map(
      (stat) => stat[statisticalShareKey] as number,
    );

    this.pieChartData.datasets[0].backgroundColor = playerImpactStatistics.map(
      () => this.randomColor(),
    );
    this.pieChartData.datasets[0].hoverBackgroundColor =
      this.pieChartData.datasets[0].backgroundColor;

    this.chart?.update();
  }

  private updateBarChartData(totalTeamStatistics: TotalTeamStatisticModel[]) {
    // Reset data
    this.barChartData = {
      labels: [
        'Points',
        'FT Miss',
        'FT Made',
        '2FG Miss',
        '2FG Made',
        '3FG Miss',
        '3FG Made',
        'Assists',
        'Off Reb',
        'Def Reb',
        'Steals',
        'Blocks',
        'Turn Overs',
        'FT%',
        '2FG%',
        '3FG%',
      ],
      datasets: totalTeamStatistics.map((teamStat) => ({
        label: teamStat.name,
        data: [
          teamStat.points,
          teamStat.onePointShotsMissed,
          teamStat.onePointShotsCompleted,
          teamStat.twoPointShotsMissed,
          teamStat.twoPointShotsCompleted,
          teamStat.threePointShotsMissed,
          teamStat.threePointShotsCompleted,
          teamStat.assists,
          teamStat.offensiveRebounds,
          teamStat.defensiveRebounds,
          teamStat.steals,
          teamStat.blocks,
          teamStat.turnOvers,
          parseFloat(teamStat.onePointShotPercentage.toFixed(2)),
          parseFloat(teamStat.twoPointShotPercentage.toFixed(2)),
          parseFloat(teamStat.threePointShotPercentage.toFixed(2)),
        ],
        backgroundColor: this.randomColor(),
      })),
    };
    console.log('drawing bar chart');
    this.chart?.update();
  }

  private randomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  onMatchStatisticFiltersChange() {
    const combinedUpdates$ = this.matchFiltersForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((values) => ({
        isAccumulativeDisplayEnabled: values.accumulateCheckBox,
        timeUnit: values.timeUnit,
        teamId: values.team === 'All teams' ? null : values.team.id,
        statisticalShare: values.statisticalShare,
      })),
      tap((filters) => this.matchStatisticPageService.changeFilters(filters)),
      switchMap((filters) =>
        this.matchStatisticPageService.matchPlayerImpactStatistic$.pipe(
          take(1),
          map((stats) => ({
            stats,
            statisticalShare: filters.statisticalShare,
          })),
        ),
      ),
      filter(({ stats, statisticalShare }) => !!stats && !!statisticalShare),
      untilDestroyed(this),
    );

    combinedUpdates$.subscribe(({ stats, statisticalShare }) => {
      if (stats) this.updateImpactChartData(stats, statisticalShare);
    });
  }

  isAdminUser() {
    return this.currentUserService.isAdminOrSuperAdmin();
  }

  onError(event: Event, team: 'home' | 'away') {
    (event.target as HTMLImageElement).src =
      `assets/images/${team === 'home' ? 'HomeTeam.png' : 'AwayTeam.png'}`;
  }

  onExportStatisticClicked(chartType: 'pie' | 'bar') {
    let statistic$: Observable<
      PlayerImpactStatisticModel[] | TotalTeamStatisticModel[] | null
    >;

    if (chartType === 'pie') {
      statistic$ = this.matchPlayerImpactStatistic$;
    } else if (chartType === 'bar') {
      statistic$ = this.totalTeamStatistic$;
    } else {
      console.error('No valid chart type selected for export.');
      return;
    }

    statistic$
      .pipe(take(1), untilDestroyed(this))
      .subscribe((statisticData) => {
        const jsonData = JSON.stringify(statisticData, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        saveAs(blob, `${chartType}Statistic.json`);
      });
  }
}
