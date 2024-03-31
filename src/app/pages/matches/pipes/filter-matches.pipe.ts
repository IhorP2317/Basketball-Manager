import { Pipe, PipeTransform } from '@angular/core';
import {Match} from "../../../core/interfaces/match/match.model";

@Pipe({
  name: 'filterMatches'
})
export class FilterMatchesPipe implements PipeTransform {
  transform(matches: Match[], status: string, exclude: boolean = false): Match[] {
    if (!matches) return [];
    return exclude
      ? matches.filter(match => match.status !== status)
      : matches.filter(match => match.status === status);
  }
}
