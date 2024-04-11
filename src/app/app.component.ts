import { Component } from '@angular/core';

import { NavigationService } from './shared/services/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public title = 'basketball-manager';
  showNav$ = this.navigationService.showNav$;

  constructor(private navigationService: NavigationService) {}
}
