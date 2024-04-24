import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { PlayerActionsForm } from '../../../core/interfaces/forms/player/player-actions-form';
import moment from 'moment';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DEFAULT_COUNTRY,
  PLAYER_ACTIONS_POSITIONS,
} from '../../constants/selectOption.constant';
import { StaffExperienceForm } from '../../../core/interfaces/forms/staff-experience/staff-experience-form';
import { dateValidator } from '../../validators/form-validators';
import { PlayerRequestDto } from '../../../core/interfaces/player/player-request.dto';
import { StaffExperienceDto } from '../../../core/interfaces/staff-experience/staff-experience.dto';

@Component({
  selector: 'app-create-and-edit-player',
  templateUrl: './create-and-edit-player.component.html',
  styleUrl: './create-and-edit-player.component.scss',
})
export class CreateAndEditPlayerComponent {
  @Input() form!: FormGroup<PlayerActionsForm>;
  @Input() action!: 'Create' | 'Edit';
  @Output() closed = new EventEmitter<void>();
  @Output() createRequested = new EventEmitter<{
    playerDto: PlayerRequestDto;
    playerImage: File | null | undefined;
  }>();
  @Output() updateRequested = new EventEmitter<{
    id: string;
    playerDto: PlayerRequestDto;
    playerImage: File | null | undefined;
  }>();
  playerImage!: File;
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

  positions = PLAYER_ACTIONS_POSITIONS;

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
    return new FormGroup<StaffExperienceForm>({
      id: new FormControl(null),
      team: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null, [
        dateValidator(
          moment().year(1891).month('December').date(1).startOf('day').toDate(),
          'min',
        ),
      ]),
      endDate: new FormControl(null, dateValidator(moment().toDate(), 'max')),
    });
  }

  onSubmit() {
    console.log(this.playerImage);
    if (this.action === 'Create') {
      this.createPlayer();
    } else if (this.action === 'Edit') {
      this.updatePlayer();
    }
  }

  createPlayer() {
    if (this.form.valid) {
      const playerExperiences: StaffExperienceDto[] =
        this.experiences.controls.map((experience) => ({
          teamId: experience.value.team.id,
          startDate: moment(experience.value.startDate).format('YYYY-MM-DD'),
          endDate: experience.value.endDate
            ? moment(experience.value.endDate).format('YYYY-MM-DD')
            : null,
        }));

      const playerDto: PlayerRequestDto = {
        firstName: this.form.value.firstName!,
        lastName: this.form.value.lastName!,
        dateOfBirth: this.form.value.birthDay
          ? moment(this.form.value.birthDay).format('YYYY-MM-DD')
          : '',
        country: this.form.value.country?.name!,
        height: this.form.value.height!,
        weight: this.form.value.weight!,
        teamId: this.form.value.team?.id ?? null,
        position: this.form.value.position!,
        jerseyNumber: this.form.value.jerseyNumber!,
        playerExperiences: playerExperiences.length ? playerExperiences : null,
      };
      this.createRequested.emit({ playerDto, playerImage: this.playerImage });
      this.closed.emit();
    }
  }

  updatePlayer() {
    if (this.form.valid) {
      const playerDto: PlayerRequestDto = {
        firstName: this.form.value.firstName!,
        lastName: this.form.value.lastName!,
        dateOfBirth: this.form.value.birthDay
          ? moment(this.form.value.birthDay).format('YYYY-MM-DD')
          : '',
        country: this.form.value.country?.name!,
        height: this.form.value.height!,
        weight: this.form.value.weight!,
        teamId: this.form.value.team?.id ?? null,
        position: this.form.value.position!,
        jerseyNumber: this.form.value.jerseyNumber!,
        playerExperiences: null,
      };
      console.log(this.playerImage);
      this.updateRequested.emit({
        id: this.form.value.id!,
        playerDto,
        playerImage: this.playerImage,
      });
      this.closed.emit();
    }
  }

  handleImageFile(image: File) {
    this.playerImage = image;
  }
}
