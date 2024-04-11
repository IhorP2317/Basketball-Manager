import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, map } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private showUserContentSubject = new BehaviorSubject<boolean>(true);
  public showUserContent$ = this.showUserContentSubject.asObservable();

  private showNavSubject = new BehaviorSubject<boolean>(true);
  public showNav$ = this.showNavSubject.asObservable();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }

          const showNav = route.snapshot.data['showNav'] !== false;
          const showUserContent =
            route.snapshot.data['showUserContent'] !== false;

          this.setShowUserContent(showUserContent);
          this.setShowNav(showNav);
        }),
        untilDestroyed(this),
      )
      .subscribe();
  }

  setShowUserContent(show: boolean) {
    this.showUserContentSubject.next(show);
  }

  setShowNav(show: boolean) {
    this.showNavSubject.next(show);
  }
}
