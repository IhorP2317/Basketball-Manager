import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private spinnerSubject = new BehaviorSubject<boolean>(false);
  public spinnerObservable$ = this.spinnerSubject.asObservable();

  public show(): void {
    this.spinnerSubject.next(true);
  }

  public hide(): void {
    this.spinnerSubject.next(false);
  }
}
