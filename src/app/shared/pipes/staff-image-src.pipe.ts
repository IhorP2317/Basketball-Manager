import { Inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'staffImageSrc',
})
export class StaffImageSrcPipe implements PipeTransform {
  constructor(@Inject('apiUrl') private baseUrl: string) {}

  transform(playerId: string): string {
    console.log(playerId);
    if (playerId) {
      return `${this.baseUrl}/players/${playerId}/avatar`;
    }

    return `assets/images/empty-staff.jpg`;
  }
}
