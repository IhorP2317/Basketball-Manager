import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../../core/interfaces/user/user.model';
import { formatDate } from '@angular/common';
import { locale } from 'moment';

@Pipe({
  name: 'userModificationTime',
})
export class UserModificationTimePipe implements PipeTransform {
  transform(user: User | null | undefined): string {
    if (!user) {
      return '';
    }
    if (!user.modifiedTime) {
      return '-';
    }
    return formatDate(user.modifiedTime, 'dd/MM/yyyy HH:mm:ss', locale());
  }
}
