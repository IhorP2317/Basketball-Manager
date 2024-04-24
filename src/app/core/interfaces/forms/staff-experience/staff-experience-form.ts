import { FormControl } from '@angular/forms';
import { Team } from '../../team/team.model';

export interface StaffExperienceForm {
  id: FormControl<string | null>;
  team: FormControl<Team | null>;
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
}
