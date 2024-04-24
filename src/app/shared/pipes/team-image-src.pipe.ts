import { Inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'teamImageSrc',
})
export class TeamImageSrcPipe implements PipeTransform {
  constructor(@Inject('apiUrl') private baseUrl: string) {}

  transform(teamId?: string): string {
    if (teamId) {
      return `${this.baseUrl}/teams/${teamId}/avatar`;
    }

    return `assets/images/default-team.png`;
  }
}
