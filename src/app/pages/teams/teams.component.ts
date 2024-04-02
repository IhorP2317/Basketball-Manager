import { Component } from '@angular/core';
import { Team } from '../../core/interfaces/team/team.model';
import { PagedListConfiguration } from '../../core/interfaces/paged-list/paged-list-configuration.dto';
import { MatDialog } from '@angular/material/dialog';
import { TeamsPageService } from './services/teams.page.service';
import { DialogData } from '../../core/interfaces/dialog/dialog-data';
import { ConfirmationDialogComponent } from '../../shared/components/dialog/confirmation-dialog.component';
import { filter } from 'rxjs';
import { untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss',
  providers: [TeamsPageService],
})
export class TeamsComponent {
  teamsPagedList = this.teamsPageService.pagedListTeams$.pipe(
    (pagedListTeams) => pagedListTeams,
  );

  selectedTeam: string | null = null;

  constructor(
    private teamsPageService: TeamsPageService,
    public dialog: MatDialog,
  ) {}

  filters = this.teamsPageService.filters$;

  onSearchTeamChanged() {
    if (this.selectedTeam !== null) {
      const trimmedString = this.selectedTeam.replace(/\\s+/g, '');
      if (trimmedString.length < 1) this.teamsPageService.setSearchedTeam(null);
    }
    this.teamsPageService.setSearchedTeam(this.selectedTeam);
  }

  onPageChangedEvent(pagingConfiguration: PagedListConfiguration) {
    this.teamsPageService.changePagedListSettings(pagingConfiguration);
  }

  onDeleteTeamClicked(team: Team): void {
    const dialogData: DialogData = {
      title: 'Confirm Action',
      message: `Are you sure you want to delete ${team.name}?`,
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result),
        untilDestroyed(this),
      )
      .subscribe((result) => {
        this.teamsPageService.deleteTeam(team.id);
      });
  }
}
