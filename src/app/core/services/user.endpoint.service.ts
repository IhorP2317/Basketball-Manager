import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PagedListConfiguration } from '../interfaces/paged-list/paged-list-configuration.dto';
import { Observable } from 'rxjs';
import { PagedList } from '../interfaces/paged-list/paged-list.model';
import { prepareQueryFiltersAndPagingSettings } from '../helpers/query-parameters.helper';
import { UserFiltersDto } from '../interfaces/user/user-filters.dto';
import { User } from '../interfaces/user/user.model';
import { UserUpdateDto } from '../interfaces/user/user-update.dto';

@Injectable({
  providedIn: 'root',
})
export class UserEndpointService {
  constructor(
    private http: HttpClient,
    @Inject('apiUrl') private baseUrl: string,
  ) {}

  getAllUsers(
    filters: UserFiltersDto,
    pagingSettings: PagedListConfiguration,
  ): Observable<PagedList<User>> {
    let params = prepareQueryFiltersAndPagingSettings(filters, pagingSettings);
    return this.http.get<PagedList<User>>(`${this.baseUrl}/users`, {
      params,
    });
  }

  updateUser(userId: string, user: UserUpdateDto) {
    return this.http.patch<void>(`${this.baseUrl}/users/${userId}`, user);
  }

  updateUserBalance(userId: string, balance: number) {
    let params = new HttpParams().set('balance', balance.toString());
    return this.http.patch<void>(
      `${this.baseUrl}/users/${userId}/balance`,
      null,
      { params },
    );
  }

  updateUserAvatar(userId: string, userImage: File) {
    const formData = new FormData();
    formData.append('picture', userImage);

    return this.http.patch<void>(
      `${this.baseUrl}/users/${userId}/avatar`,
      formData,
    );
  }

  deleteUser(userId: string) {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`);
  }
}
