import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AwardEndpointService {
  constructor(
    private http: HttpClient,
    @Inject('apiUrl') private baseUrl: string,
  ) {}

  updateAvatar(avatarId: string, file: File) {
    const formData = new FormData();
    formData.append('picture', file);

    return this.http.patch<void>(
      `${this.baseUrl}/awards/${avatarId}/avatar`,
      formData,
    );
  }
}
