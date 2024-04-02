import { Inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'matchTeamImageSrc',
})
export class MatchTeamImageSrcPipe implements PipeTransform {
  constructor(@Inject('apiUrl') private baseUrl: string) {}

  transform(teamId: string, team: 'home' | 'away'): string {
    console.log(this.baseUrl);
    if (teamId) {
      return `${this.baseUrl}/teams/${teamId}/avatar`;
    }
    return `assets/images/${team === 'home' ? 'HomeTeam.png' : 'AwayTeam.png'}`;
  }
}
