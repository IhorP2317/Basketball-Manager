import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'totalAnnualStatisticYear',
})
export class TotalAnnualStatisticYearPipe implements PipeTransform {
  transform(year: number): string {
    if (year > 1891) {
      return year.toString();
    } else if (year === 0) {
      return 'Total';
    } else if (year === -1) {
      return 'Average';
    } else {
      return 'N/A';
    }
  }
}
