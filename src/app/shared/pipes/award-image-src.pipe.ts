import { Inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'awardImageSrc',
})
export class AwardImageSrcPipe implements PipeTransform {
  constructor(@Inject('apiUrl') private baseUrl: string) {}

  transform(awardId: string): unknown {
    if (awardId) {
      return `${this.baseUrl}/awards/${awardId}/avatar`;
    }

    return `assets/images/empty-award.png`;
  }
}
