import { FormControl } from '@angular/forms';
import { Team } from '../../team/team.model';

export interface PlayerExperienceForm {
  team: FormControl<Team | null>;
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
}
