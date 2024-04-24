import { FormControl } from '@angular/forms';
import { CoachExperienceDetail } from '../../staff-experience/coach-experience-detail.model';
import { PlayerExperienceDetail } from '../../staff-experience/player-experience-detail.model';

export interface AwardActionsForm {
  staffExperience: FormControl<
    CoachExperienceDetail | PlayerExperienceDetail | null
  >;
  name: FormControl<string | null>;
  date: FormControl<Date | null>;
  isIndividualAward: FormControl<boolean>;
  avatar: FormControl<string | null>;
}
