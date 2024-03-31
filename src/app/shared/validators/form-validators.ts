import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function passwordsMatchValidator(
  matchTo: string,
  reverse?: boolean
): ValidatorFn {
  return (control: AbstractControl):
    ValidationErrors | null => {
    if (control.parent && reverse) {
      const c = (control.parent?.controls as any)[matchTo]
      if (c) {
        c.updateValueAndValidity();
      }
      return null;
    }
    return !!control.parent && !!control.parent.value &&
    control.value === (control.parent?.controls as any)[matchTo].value
      ? null
      : { passwordsMismatch: true };
  };
}
