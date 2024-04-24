import { Inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currentUserImgSrc',
})
export class CurrentImageSrcPipe implements PipeTransform {
  constructor(@Inject('apiUrl') private baseUrl: string) {}

  transform(userId: string | null): string {
    if (userId) {
      const url = `${this.baseUrl}/users/${userId}/avatar?randomise=${Math.random()}`;
      console.log(url);
      return url;
    }
    return `assets/images/empty-staff.png`;
  }
}
