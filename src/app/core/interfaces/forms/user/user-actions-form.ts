import { FormControl } from '@angular/forms';

export interface UserActionsForm {
  id: FormControl<string | null>;
  lastName: FormControl<string | null>;
  firstName: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
  balance: FormControl<number | null>;
  avatar: FormControl<string | null>;
  role: FormControl<string | null>;
}
