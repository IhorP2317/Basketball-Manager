import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AwardActionsForm } from '../../../core/interfaces/forms/award/award-actions-form';
import { AwardRequestDto } from '../../../core/interfaces/awards/award-request.dto';
import moment from 'moment';
import { CoachExperienceDetail } from '../../../core/interfaces/staff-experience/coach-experience-detail.model';
import { PlayerExperienceDetail } from '../../../core/interfaces/staff-experience/player-experience-detail.model';

@Component({
  selector: 'app-create-award',
  templateUrl: './create-award.component.html',
  styleUrl: './create-award.component.scss',
})
export class CreateAwardComponent {
  @Input() form!: FormGroup<AwardActionsForm>;
  @Input() experiences!: (CoachExperienceDetail | PlayerExperienceDetail)[];
  @Output() closed = new EventEmitter<void>();
  @Output() createRequested = new EventEmitter<{
    staffExperienceId: string;
    awardDto: AwardRequestDto;
    awardImage?: File | null | undefined;
  }>();
  errorMessage: string | null = null;
  awardImage!: File;
  minExperienceDate = moment()
    .year(1891)
    .month('December')
    .date(1)
    .startOf('day')
    .toDate();
  maxExperienceDate = moment().endOf('day').toDate();

  onSubmit() {
    if (this.form.valid) {
      this.createRequested.emit({
        staffExperienceId: this.form.value.staffExperience!.id,
        awardDto: this.buildAwardDto(),
        awardImage: this.awardImage,
      });
      this.closed.emit();
    }
  }

  buildAwardDto() {
    return {
      name: this.form.value.name!,
      date: moment(this.form.value.date).format('YYYY-MM-DD')!,
      isIndividualAward: this.form.value.isIndividualAward!,
    };
  }

  handleImageFile(image: File) {
    this.awardImage = image;
  }
}
