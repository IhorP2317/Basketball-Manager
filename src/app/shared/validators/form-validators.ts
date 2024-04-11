import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';

export function passwordsMatchValidator(
  matchTo: string,
  reverse?: boolean,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.parent && reverse) {
      const c = (control.parent?.controls as any)[matchTo];
      if (c) {
        c.updateValueAndValidity();
      }
      return null;
    }
    return !!control.parent &&
      !!control.parent.value &&
      control.value === (control.parent?.controls as any)[matchTo].value
      ? null
      : { passwordsMismatch: true };
  };
}

export function dateValidator(date: Date, type: 'max' | 'min'): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }

    const inputDate = moment(control.value);
    if (type === 'min' && inputDate.isBefore(date, 'day')) {
      return { minDate: { min: date, actual: inputDate } };
    }

    if (type === 'max' && inputDate.isAfter(date, 'day')) {
      return { maxDate: { max: date, actual: inputDate } };
    }

    return null;
  };
}
