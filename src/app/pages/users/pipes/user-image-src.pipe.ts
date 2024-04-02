import { Inject, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userImageSrc',
})
export class UserImageSrcPipe implements PipeTransform {
  constructor(@Inject('apiUrl') private baseUrl: string) {}

  transform(userId: string): string {
    if (userId) {
      return `${this.baseUrl}/users/${userId}/avatar`;
    }
    return `assets/images/empty-staff.png`;
  }
}
