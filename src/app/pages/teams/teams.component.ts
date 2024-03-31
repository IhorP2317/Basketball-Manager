import { Component } from '@angular/core';
import {PagedList} from "../../core/interfaces/paged-list/paged-list.model";
import {Team} from "../../core/interfaces/team/team.model";
import {PagedListConfiguration} from "../../core/interfaces/paged-list/paged-list-configuration.dto";
import moment from "moment/moment";
import {MatchesPageService} from "../matches/services/matches.page.service";
import {MatDialog} from "@angular/material/dialog";
import {TeamsPageService} from "./services/teams.page.service";
import {DialogData} from "../../core/interfaces/dialog/dialog-data";
import {ConfirmationDialogComponent} from "../../shared/components/dialog/confirmation-dialog.component";

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss',
  providers: [TeamsPageService]
})
export class TeamsComponent {
  teamsPagedList = this.teamsPageService.pagedListTeams$.pipe(
    (pagedListTeams) => pagedListTeams,
  );
  filters = this.teamsPageService.filters$.pipe((filters) => filters);
  selectedTeam: string | null = null;

  constructor(
    private teamsPageService: TeamsPageService,
    public dialog: MatDialog,
  ) {}
  onSearchTeamChanged() {
    if(this.selectedTeam !== null) {
      const trimmedString = this.selectedTeam.replace(/\\s+/g, '');
      if(trimmedString.length < 1)
      this.teamsPageService.setSearchedTeam(null);
    }
      this.teamsPageService.setSearchedTeam(this.selectedTeam);
  }
  onPageChangedEvent(pagingConfiguration: PagedListConfiguration) {
    this.teamsPageService.changePagedListSettings(pagingConfiguration);
  }
  onDeleteMatchClicked(team: Team): void {
    const dialogData: DialogData = {
      title: 'Confirm Action',
      message: `Are you sure you want to delete ${team.name}?`,
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.teamsPageService.deleteTeam(team.id);
      }
    });
  }

}
