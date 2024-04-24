import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CoachExperienceForm } from '../../../../core/interfaces/forms/staff-experience/coach-experience-form';
import { FormGroup } from '@angular/forms';
import { CoachExperienceDto } from '../../../../core/interfaces/staff-experience/coach-experience.dto';
import { StaffExperienceUpdateDto } from '../../../../core/interfaces/staff-experience/staff-experience-update.dto';
import moment from 'moment/moment';
import { PlayerService } from '../../../../shared/services/player.service';
import { COACH_ACTIONS_STATUSES } from '../../../../shared/constants/selectOption.constant';

@Component({
  selector: 'app-create-and-edit-coach-experience',
  templateUrl: './create-and-edit-coach-experience.component.html',
  styleUrl: './create-and-edit-coach-experience.component.scss',
})
export class CreateAndEditCoachExperienceComponent {
  @Input() form!: FormGroup<CoachExperienceForm>;
  @Input() action!: 'Create' | 'Edit';
  @Output() closed = new EventEmitter<void>();
  @Output() createRequested = new EventEmitter<CoachExperienceDto>();
  @Output() updateRequested = new EventEmitter<{
    coachExperienceId: string;
    coachExperienceUpdateDto: StaffExperienceUpdateDto;
  }>();
  errorMessage: string | null = null;
  selectTeams$ = this.playerService.teams$;
  minExperienceDate = moment()
    .year(1891)
    .month('December')
    .date(1)
    .startOf('day')
    .toDate();
  maxExperienceDate = moment().endOf('day').toDate();
  statuses = COACH_ACTIONS_STATUSES;

  constructor(private playerService: PlayerService) {}

  onSubmit() {
    if (this.action === 'Create') {
      this.createCoachExperience();
    } else if (this.action === 'Edit') {
      this.updateCoachExperience();
    }
  }

  createCoachExperience() {
    if (this.form.valid) {
      this.createRequested.emit(this.buildCoachExperienceDto());
      this.closed.emit();
    }
  }

  updateCoachExperience() {
    if (this.form.valid) {
      this.updateRequested.emit({
        coachExperienceId: this.form.value.id!,
        coachExperienceUpdateDto: { ...this.buildCoachExperienceDto() },
      });
      this.closed.emit();
    }
  }

  buildCoachExperienceDto() {
    return {
      startDate: moment(this.form.value.startDate).format('YYYY-MM-DD'),
      status: this.form.value.status!,
      endDate: this.form.value.endDate
        ? moment(this.form.value.endDate).format('YYYY-MM-DD')
        : null,
      teamId: this.form.value.team!.id,
    };
  }
}
