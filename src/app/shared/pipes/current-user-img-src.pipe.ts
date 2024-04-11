import { Inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currentUserImgSrc',
})
export class CurrentImageSrcPipe implements PipeTransform {
  constructor(@Inject('apiUrl') private baseUrl: string) {}

  transform(userId: string): string {
    if (userId) {
      return `${this.baseUrl}/users/${userId}/avatar`;
    }
    return `assets/images/empty-staff.png`;
  }
}
