import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Country } from '@angular-material-extensions/select-country';
import { Team } from '../../team/team.model';
import { StaffExperienceForm } from '../staff-experience/staff-experience-form';

export interface PlayerActionsForm {
  id: FormControl<string | null>;
  firstName: FormControl<string | null>;
  lastName: FormControl<string | null>;
  birthDay: FormControl<Date | null>;
  country: FormControl<Country | null>;
  height: FormControl<number | null>;
  weight: FormControl<number | null>;
  team: FormControl<Team | null>;
  position: FormControl<string | null>;
  jerseyNumber: FormControl<number | null>;
  experiences: FormArray<FormGroup<StaffExperienceForm>>;
  avatar: FormControl<string | null>;
}
