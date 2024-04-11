import { Component } from '@angular/core';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  public spinnerStatus$ = this.spinnerService.spinnerObservable$;

  constructor(private spinnerService: SpinnerService) {}
}
