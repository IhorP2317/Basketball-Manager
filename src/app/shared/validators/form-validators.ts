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

export const dateRangeValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const startDateControl = group.get('startTime');
  const endDateControl = group.get('endTime');
  if (
    !startDateControl ||
    !endDateControl ||
    !startDateControl.value ||
    !endDateControl.value
  ) {
    return null;
  }

  const startDate = startDateControl.value;
  const endDate = endDateControl.value;

  if (moment(endDate).isBefore(moment(startDate))) {
    return { dateRangeError: 'End date must be after the start date' };
  }

  return null;
};
export const distinctTeamsValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const homeTeamControl = group.get('homeTeam');
  const awayTeamControl = group.get('awayTeam');

  if (!homeTeamControl || !awayTeamControl) {
    return null;
  }

  const homeTeam = homeTeamControl.value;
  const awayTeam = awayTeamControl.value;

  if (homeTeam && awayTeam && homeTeam.id === awayTeam.id) {
    return { sameTeamError: 'Home team and away team cannot be the same' };
  }

  return null;
};
export const timeLimitValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const minutes = control.get('minutes')?.value;
  const seconds = control.get('seconds')?.value;
  const totalTimeInSeconds = minutes * 60 + seconds;

  return totalTimeInSeconds <= 720 ? null : { timeLimitExceeded: true };
};
export const dateWithinExperienceRangeValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const staffExperience = control.get('staffExperience')?.value;
  const awardDate = control.get('date')?.value;

  if (!staffExperience || !awardDate) {
    return null;
  }

  const startDate = new Date(staffExperience.startDate);
  const endDate = staffExperience.endDate
    ? new Date(staffExperience.endDate)
    : new Date();

  if (
    awardDate >= startDate &&
    (!staffExperience.endDate || awardDate <= endDate)
  ) {
    return null;
  }

  return { dateOutsideExperienceRange: true };
};
