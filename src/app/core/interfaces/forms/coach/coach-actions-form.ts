import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Country } from '@angular-material-extensions/select-country';
import { Team } from '../../team/team.model';
import { CoachExperienceForm } from '../staff-experience/coach-experience-form';

export interface CoachActionsForm {
  id: FormControl<string | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  birthDay: FormControl<Date | null>;
  country: FormControl<Country | null>;
  team: FormControl<Team | null>;
  coachStatus: FormControl<string | null>;
  specialty: FormControl<string | null>;
  experiences: FormArray<FormGroup<CoachExperienceForm>>;
  avatar: FormControl<string | null>;
}
