import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation-tap-group',
  templateUrl: './navigation-tap-group.component.html',
  styleUrl: './navigation-tap-group.component.scss'
})
export class NavigationTapGroupComponent {
  navLinks = [
    { path: '/matches', label: 'MATCHES' },
    { path: '/teams', label: 'TEAMS' },
    { path: '/players', label: 'PLAYERS' },
    { path: '/users', label: 'USERS' }
  ];
}
