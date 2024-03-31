import { Pipe, PipeTransform } from '@angular/core';
import {Match} from "../../../core/interfaces/match/match.model";

@Pipe({
  name: 'matchScore'
})
export class MatchScorePipe implements PipeTransform {
  transform(match: Match | undefined): string {
    if(match == null){
      return '';
    }
    if (match.homeTeamScore == null || match.awayTeamScore == null) {
      return '-';
    }
    return `${match.homeTeamScore} / ${match.awayTeamScore}`;
  }
}
