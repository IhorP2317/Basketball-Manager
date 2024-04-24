import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment/moment';
import {
  COACH_ACTIONS_SPECIALITIES,
  COACH_ACTIONS_STATUSES,
  DEFAULT_COUNTRY,
} from '../../constants/selectOption.constant';
import { PlayerService } from '../../services/player.service';
import { dateValidator } from '../../validators/form-validators';
import { CoachActionsForm } from '../../../core/interfaces/forms/coach/coach-actions-form';
import { CoachRequestDto } from '../../../core/interfaces/coach/coach-request.dto';
import { CoachExperienceForm } from '../../../core/interfaces/forms/staff-experience/coach-experience-form';
import { CoachExperienceDto } from '../../../core/interfaces/staff-experience/coach-experience.dto';

@Component({
  selector: 'app-create-and-edit-coach',
  templateUrl: './create-and-edit-coach.component.html',
  styleUrl: './create-and-edit-coach.component.scss',
})
export class CreateAndEditCoachComponent {
  @Input() form!: FormGroup<CoachActionsForm>;
  @Input() action!: 'Create' | 'Edit';
  @Output() closed = new EventEmitter<void>();
  @Output() createRequested = new EventEmitter<{
    coachDto: CoachRequestDto;
    coachImage: File | null | undefined;
  }>();
  @Output() updateRequested = new EventEmitter<{
    id: string;
    coachDto: CoachRequestDto;
    coachImage: File | null | undefined;
  }>();
  coachImage!: File;
  protected readonly DEFAULT_COUNTRY = DEFAULT_COUNTRY;
  errorMessage: string | null = null;
  selectTeams$ = this.playersPageService.teams$;
  maxBirthDate = moment().subtract(18, 'year').toDate();
  minExperienceDate = moment()
    .year(1891)
    .month('December')
    .date(1)
    .startOf('day')
    .toDate();
  maxExperienceDate = moment().endOf('day').toDate();

  specialties = COACH_ACTIONS_SPECIALITIES;
  statuses = COACH_ACTIONS_STATUSES;

  constructor(private playersPageService: PlayerService) {}

  onAddExperienceClick() {
    this.form.controls.experiences.push(this.createExperienceControl());
  }

  onRemoveExperienceClick(index: number) {
    this.form.controls.experiences.removeAt(index);
  }

  get experiences() {
    return this.form.controls['experiences'] as FormArray;
  }

  createExperienceControl() {
    return new FormGroup<CoachExperienceForm>({
      id: new FormControl(null),
      team: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null, [
        dateValidator(
          moment().year(1891).month('December').date(1).startOf('day').toDate(),
          'min',
        ),
      ]),
      endDate: new FormControl(null, dateValidator(moment().toDate(), 'max')),
      status: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    if (this.action === 'Create') {
      this.createCoach();
    } else if (this.action === 'Edit') {
      this.updateCoach();
    }
  }

  createCoach() {
    if (this.form.valid) {
      const coachExperiences: CoachExperienceDto[] =
        this.experiences.controls.map((experience) => ({
          teamId: experience.value.team.id,
          startDate: moment(experience.value.startDate).format('YYYY-MM-DD'),
          endDate: experience.value.endDate
            ? moment(experience.value.endDate).format('YYYY-MM-DD')
            : null,
          status: experience.value.status,
        }));

      const coachDto: CoachRequestDto = {
        firstName: this.form.value.firstName!,
        lastName: this.form.value.lastName!,
        dateOfBirth: this.form.value.birthDay
          ? moment(this.form.value.birthDay).format('YYYY-MM-DD')
          : '',
        country: this.form.value.country?.name!,
        coachStatus: this.form.value.coachStatus!,
        specialty: this.form.value.specialty!,
        teamId: this.form.value.team?.id ?? null,
        coachExperiences: coachExperiences.length ? coachExperiences : null,
      };
      this.createRequested.emit({
        coachDto: coachDto,
        coachImage: this.coachImage,
      });
      this.closed.emit();
    }
  }

  updateCoach() {
    if (this.form.valid) {
      const coachDto: CoachRequestDto = {
        firstName: this.form.value.firstName!,
        lastName: this.form.value.lastName!,
        dateOfBirth: this.form.value.birthDay
          ? moment(this.form.value.birthDay).format('YYYY-MM-DD')
          : '',
        country: this.form.value.country?.name!,
        coachStatus: this.form.value.coachStatus!,
        specialty: this.form.value.specialty!,
        teamId: this.form.value.team?.id ?? null,
        coachExperiences: null,
      };
      this.updateRequested.emit({
        id: this.form.value.id!,
        coachDto: coachDto,
        coachImage: this.coachImage,
      });
      this.closed.emit();
    }
  }

  handleImageFile(image: File) {
    this.coachImage = image;
  }
}
