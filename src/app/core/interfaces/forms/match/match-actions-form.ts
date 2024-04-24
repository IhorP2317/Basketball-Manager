import { FormControl } from '@angular/forms';
import { Team } from '../../team/team.model';

export interface MatchActionsForm {
  id: FormControl<string | null>;
  location: FormControl<string | null>;
  startTime: FormControl<string | null>;
  endTime: FormControl<string | null>;
  homeTeam: FormControl<Team | null>;
  awayTeam: FormControl<Team | null>;
  sectionCount: FormControl<number | null>;
  rowCount: FormControl<number | null>;
  seatCount: FormControl<number | null>;
  status: FormControl<string | null>;
}
