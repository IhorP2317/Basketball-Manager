import { Component, Inject, OnInit } from '@angular/core';
import { Team } from '../../core/interfaces/team/team.model';
import { PagedListConfiguration } from '../../core/interfaces/paged-list/paged-list-configuration.dto';
import { MatDialog } from '@angular/material/dialog';
import { TeamsPageService } from './services/teams.page.service';
import { DialogData } from '../../core/interfaces/dialog/dialog-data';
import { ConfirmationDialogComponent } from '../../shared/components/dialog/confirmation-dialog.component';
import { filter, take } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { TeamDto } from '../../core/interfaces/team/team.dto';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TeamActionsForm } from '../../core/interfaces/forms/team/team-actions-form';
import { TEAM_NAME_PATTERN } from '../../shared/constants/form.constant';
import { ImageInspectorService } from '../../shared/services/image-inspector.service';

@UntilDestroy()
@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss',
  providers: [TeamsPageService],
})
export class TeamsComponent implements OnInit {
  teamsPagedList = this.teamsPageService.pagedListTeams$.pipe(
    (pagedListTeams) => pagedListTeams,
  );
  teamActionsForm!: FormGroup<TeamActionsForm>;
  selectedTeam: string | null = null;

  constructor(
    private teamsPageService: TeamsPageService,
    public dialog: MatDialog,
    private currentUserService: CurrentUserService,
    private imageInspectorService: ImageInspectorService,
    @Inject('apiUrl') private apiUrl: string,
  ) {}

  ngOnInit() {
    this.initializeTeamForm();
  }

  initializeTeamForm() {
    this.teamActionsForm = new FormGroup<TeamActionsForm>({
      id: new FormControl(''),
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(TEAM_NAME_PATTERN),
      ]),
      avatar: new FormControl(''),
    });
  }

  fillUpdateTeamForm(team: Team) {
    this.teamActionsForm.reset();
    this.teamActionsForm.controls.id.setValue(team.id);
    this.teamActionsForm.controls.name.setValue(team.name);

    const avatarUrl = this.apiUrl + `/teams/${team.id}/avatar`;

    this.imageInspectorService
      .checkImageURL(avatarUrl)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((exists) => {
        const avatarValue = exists ? avatarUrl : null;
        this.teamActionsForm.controls.avatar.setValue(avatarValue);
      });
  }

  fillCreateTeamForm() {
    this.teamActionsForm.reset();
    this.teamActionsForm.controls.id.setValue('');
    this.teamActionsForm.controls.name.setValue('');
    this.teamActionsForm.controls.avatar.setValue(null);
  }

  filters = this.teamsPageService.filters$;

  isAdminUser() {
    return this.currentUserService.isAdminOrSuperAdmin();
  }

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

  handleCreateTeam(eventData: {
    teamDto: TeamDto;
    teamImage: File | null | undefined;
  }) {
    this.teamsPageService.createTeam(eventData.teamDto, eventData.teamImage);
  }

  handleUpdateTeam(eventData: {
    id: string;
    teamDto: TeamDto;
    teamImage: File | null | undefined;
  }) {
    this.teamsPageService.updateTeam(
      eventData.id,
      eventData.teamDto,
      eventData.teamImage,
    );
  }
}
