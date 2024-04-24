import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageInspectorService {
  constructor(private http: HttpClient) {}

  checkImageURL(url: string): Observable<boolean> {
    return this.http
      .get(url, { observe: 'response', responseType: 'blob' })
      .pipe(
        tap((response) => console.log(response)),
        map((response) => response.status === 200),
        catchError((error: HttpErrorResponse) => of(error.status !== 404)),
      );
  }
}
