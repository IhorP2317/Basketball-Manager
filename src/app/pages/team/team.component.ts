import { Component, OnInit } from '@angular/core';
import { TeamDetail } from '../../core/interfaces/team/team-detail.model';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { TeamPageService } from './services/team.page.service';
import { PlayerService } from '../../shared/services/player.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, map, switchMap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
  providers: [TeamPageService],
})
export class TeamComponent implements OnInit {
  team!: TeamDetail;

  constructor(
    private teamPageService: TeamPageService,
    private playerService: PlayerService,
    private currentUserService: CurrentUserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        map((params) => params['id']),
        switchMap((id) => {
          if (!id) {
            this.router.navigate(['/not-found']);
            return EMPTY;
          }
          return this.teamPageService.loadTeam$(id);
        }),
        untilDestroyed(this),
      )
      .subscribe((teamDetail) => {
        if (!teamDetail) {
          this.router.navigate(['/not-found']);
        } else {
          this.team = teamDetail;
        }
      });
  }

  isAdminUser() {
    return this.currentUserService.isAdminOrSuperAdmin();
  }

  onError(event: Event) {
    (event.target as HTMLImageElement).src = `assets/images/default-team.png`;
  }
}
