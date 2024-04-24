import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StatisticActionsForm } from '../../../../core/interfaces/forms/statistic/statistic-actions-form';
import { PlayerExperienceDetail } from '../../../../core/interfaces/staff-experience/player-experience-detail.model';
import { StatisticDto } from '../../../../core/interfaces/statistic/statistic.dto';

@Component({
  selector: 'app-create-and-edit-statistic',
  templateUrl: './create-and-edit-statistic.component.html',
  styleUrl: './create-and-edit-statistic.component.scss',
})
export class CreateAndEditStatisticComponent {
  @Input() form!: FormGroup<StatisticActionsForm>;
  @Input() playerExperiences!: PlayerExperienceDetail[];
  @Input() action!: 'Create' | 'Edit';
  @Output() closed = new EventEmitter<void>();
  @Output() createRequested = new EventEmitter<StatisticDto>();
  @Output() updateRequested = new EventEmitter<StatisticDto>();
  errorMessage: string | null = null;
  maxSecond = 59;
  maxMinute = 12;
  minFieldValue = 0;
  minTimeUnit = 1;

  onSubmit() {
    if (this.action === 'Create') {
      this.createStatistic();
    } else if (this.action === 'Edit') {
      this.updateStatistic();
    }
  }

  createStatistic() {
    if (this.form.valid) {
      this.createRequested.emit(this.buildStatisticDto());
      this.closed.emit();
    }
  }

  updateStatistic() {
    if (this.form.valid) {
      this.updateRequested.emit(this.buildStatisticDto());
      this.closed.emit();
    }
  }

  buildStatisticDto() {
    return {
      matchId: this.form.value.matchId!,
      playerExperienceId: this.form.value.playerExperience!.id,
      timeUnit: this.form.value.timeUnit!,
      onePointShotHitCount: this.form.value.onePointShotHitCount!,
      onePointShotMissCount: this.form.value.onePointShotMissCount!,
      twoPointShotHitCount: this.form.value.twoPointShotHitCount!,
      twoPointShotMissCount: this.form.value.twoPointShotMissCount!,
      threePointShotHitCount: this.form.value.threePointShotHitCount!,
      threePointShotMissCount: this.form.value.threePointShotMissCount!,
      assistCount: this.form.value.assistCount!,
      offensiveReboundCount: this.form.value.offensiveReboundCount!,
      defensiveReboundCount: this.form.value.defensiveReboundCount!,
      stealCount: this.form.value.stealCount!,
      blockCount: this.form.value.blockCount!,
      turnoverCount: this.form.value.turnoverCount!,
      courtTime: this.formatTime(
        this.form.value.minutes!,
        this.form.value.seconds!,
      ),
    };
  }

  formatTime(minutes: number, seconds: number): string {
    const hoursString = '00'; // Assuming hours are always 0
    const minutesString = minutes.toString().padStart(2, '0');
    const secondsString = seconds.toString().padStart(2, '0');
    return `${hoursString}:${minutesString}:${secondsString}`;
  }
}
