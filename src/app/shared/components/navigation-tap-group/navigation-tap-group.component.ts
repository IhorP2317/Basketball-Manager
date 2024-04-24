import { Component } from '@angular/core';
import { CurrentUserService } from '../../services/current-user.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-navigation-tap-group',
  templateUrl: './navigation-tap-group.component.html',
  styleUrl: './navigation-tap-group.component.scss',
})
export class NavigationTapGroupComponent {
  navLinks!: any[];

  constructor(private currentUserService: CurrentUserService) {
    this.currentUserService.isAdminOrSuperAdmin$
      .pipe(untilDestroyed(this))
      .subscribe((isAdmin) => {
        this.setupNavigation(isAdmin ? isAdmin : false);
      });
  }

  setupNavigation(isAdmin: boolean) {
    const links = [
      { path: '/matches', label: 'MATCHES' },
      { path: '/teams', label: 'TEAMS' },
      { path: '/players', label: 'PLAYERS' },
      { path: '/users', label: 'USERS', adminOnly: true },
    ];

    this.navLinks = links.filter((link) => !link.adminOnly || isAdmin);
  }
}
