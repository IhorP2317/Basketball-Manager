import { Inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'teamImageSrc',
})
export class TeamImageSrcPipe implements PipeTransform {
  constructor(@Inject('apiUrl') private baseUrl: string) {}

  transform(teamId?: string): string {
    console.log(teamId);
    // @ts-ignore
    window['teamId'] = teamId;
    if (teamId) {
      return `${this.baseUrl}/teams/${teamId}/avatar`;
    }

    return `assets/images/default-team.png`;
  }
}
