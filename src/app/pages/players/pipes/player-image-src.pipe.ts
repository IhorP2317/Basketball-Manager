import { Inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'playerImageSrc',
})
export class PlayerImageSrcPipe implements PipeTransform {
  constructor(@Inject('apiUrl') private baseUrl: string) {}

  transform(playerId: string): string {
    if (playerId) {
      return `${this.baseUrl}/players/${playerId}/avatar`;
    }
    return `assets/images/empty-staff.png`;
  }
}
