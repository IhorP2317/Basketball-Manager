import { StaffExperienceForm } from './staff-experience-form';
import { FormControl } from '@angular/forms';

export interface CoachExperienceForm extends StaffExperienceForm {
  status: FormControl<string | null>;
}
