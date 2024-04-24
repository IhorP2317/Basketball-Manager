import { FormControl } from '@angular/forms';

export interface TeamActionsForm {
  id: FormControl<string | null>;
  name: FormControl<string | null>;
  avatar: FormControl<string | null>;
}
