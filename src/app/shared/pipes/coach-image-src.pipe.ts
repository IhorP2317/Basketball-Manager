import { Inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coachImageSrc',
})
export class CoachImageSrcPipe implements PipeTransform {
  constructor(@Inject('apiUrl') private baseUrl: string) {}

  transform(coachId: string): string {
    if (coachId) {
      return `${this.baseUrl}/teams/coaches/${coachId}/avatar`;
    }

    return `assets/images/empty-staff.jpg`;
  }
}
