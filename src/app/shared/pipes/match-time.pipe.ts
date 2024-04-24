import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Match } from '../../core/interfaces/match/match.model';
import { MatchDetail } from '../../core/interfaces/match/match-detail.model';

@Pipe({
  name: 'matchTime',
})
export class MatchTimePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(match: Match | MatchDetail | null | undefined): string {
    if (match == null) {
      return '';
    }
    const startDateTime = match.startTime ? new Date(match.startTime) : null;
    const endDateTime = match.endTime ? new Date(match.endTime) : null;
    if (!startDateTime) {
      return '-';
    }
    const formattedStartTime = this.datePipe.transform(
      startDateTime,
      'dd/MM/yyyy HH:mm:ss',
    );
    if (!endDateTime) {
      return formattedStartTime || '';
    }

    // Format the end time if it exists
    const formattedEndTime = this.datePipe.transform(
      endDateTime,
      'dd/MM/yyyy HH:mm:ss',
    );
    return `${formattedStartTime} - ${formattedEndTime}`;
  }
}
