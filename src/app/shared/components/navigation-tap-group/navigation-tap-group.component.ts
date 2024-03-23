import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation-tap-group',
  templateUrl: './navigation-tap-group.component.html',
  styleUrl: './navigation-tap-group.component.scss'
})
export class NavigationTapGroupComponent {
  navLinks = [
    { path: '/matches', label: 'Matches' },
    { path: '/teams', label: 'Teams' },
    { path: '/players', label: 'Players' },
    { path: '/users', label: 'Users' }
  ];
  activeLink = this.navLinks[0];
}
