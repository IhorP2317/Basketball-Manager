import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthName'
})
export class MonthNamePipe implements PipeTransform {

  transform(value: number | null | undefined): string {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];


    if (value === null || value === undefined) {
      return '';
    }

    if (value >= 0 && value < monthNames.length) {
      return monthNames[value];
    }

    return 'Invalid month';
  }

}
