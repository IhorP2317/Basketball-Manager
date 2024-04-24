import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StaffExperienceUpdateDto } from '../../../../core/interfaces/staff-experience/staff-experience-update.dto';
import moment from 'moment';
import { StaffExperienceDto } from '../../../../core/interfaces/staff-experience/staff-experience.dto';
import { StaffExperienceForm } from '../../../../core/interfaces/forms/staff-experience/staff-experience-form';
import { PlayerService } from '../../../../shared/services/player.service';

@Component({
  selector: 'app-create-and-edit-player-experience',
  templateUrl: './create-and-edit-player-experience.component.html',
  styleUrl: './create-and-edit-player-experience.component.scss',
})
export class CreateAndEditPlayerExperienceComponent {
  @Input() form!: FormGroup<StaffExperienceForm>;
  @Input() action!: 'Create' | 'Edit';
  @Output() closed = new EventEmitter<void>();
  @Output() createRequested = new EventEmitter<StaffExperienceDto>();
  @Output() updateRequested = new EventEmitter<{
    playerExperienceId: string;
    playerExperienceUpdateDto: StaffExperienceUpdateDto;
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

  constructor(private playerService: PlayerService) {}

  onSubmit() {
    if (this.action === 'Create') {
      this.createPlayerExperience();
    } else if (this.action === 'Edit') {
      this.updatePlayerExperience();
    }
  }

  createPlayerExperience() {
    if (this.form.valid) {
      this.createRequested.emit(this.buildCoachExperienceDto());
      this.closed.emit();
    }
  }

  updatePlayerExperience() {
    if (this.form.valid) {
      this.updateRequested.emit({
        playerExperienceId: this.form.value.id!,
        playerExperienceUpdateDto: { ...this.buildCoachExperienceDto() },
      });
      this.closed.emit();
    }
  }

  buildCoachExperienceDto() {
    return {
      startDate: moment(this.form.value.startDate).format('YYYY-MM-DD'),
      endDate: this.form.value.endDate
        ? moment(this.form.value.endDate).format('YYYY-MM-DD')
        : null,
      teamId: this.form.value.team!.id,
    };
  }
}
