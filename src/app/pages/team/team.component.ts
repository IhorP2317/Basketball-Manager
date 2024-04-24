import { Component, Inject, OnInit } from '@angular/core';
import { TeamDetail } from '../../core/interfaces/team/team-detail.model';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { TeamPageService } from './services/team.page.service';
import { PlayerService } from '../../shared/services/player.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, filter, map, switchMap, take } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PlayerRequestDto } from '../../core/interfaces/player/player-request.dto';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PlayerActionsForm } from '../../core/interfaces/forms/player/player-actions-form';
import moment from 'moment';
import { Player } from '../../core/interfaces/player/player.model';
import { NAME_PATTERN } from '../../shared/constants/form.constant';
import { dateValidator } from '../../shared/validators/form-validators';
import { StaffExperienceForm } from '../../core/interfaces/forms/staff-experience/staff-experience-form';
import {
  COUNTRIES_DB,
  Country,
} from '@angular-material-extensions/select-country';
import { ImageInspectorService } from '../../shared/services/image-inspector.service';
import { DialogData } from '../../core/interfaces/dialog/dialog-data';
import { ConfirmationDialogComponent } from '../../shared/components/dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CoachActionsForm } from '../../core/interfaces/forms/coach/coach-actions-form';
import {
  COACH_ACTIONS_SPECIALITIES,
  COACH_ACTIONS_STATUSES,
} from '../../shared/constants/selectOption.constant';
import { CoachExperienceForm } from '../../core/interfaces/forms/staff-experience/coach-experience-form';
import { Coach } from '../../core/interfaces/coach/coach.model';
import { CoachRequestDto } from '../../core/interfaces/coach/coach-request.dto';
import { CoachService } from '../../shared/services/coach.service';

@UntilDestroy()
@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
  providers: [TeamPageService],
})
export class TeamComponent implements OnInit {
  team!: TeamDetail;
  playerActionsForm!: FormGroup<PlayerActionsForm>;
  coachActionsForm!: FormGroup<CoachActionsForm>;
  countries: Country[] = COUNTRIES_DB;
  coachStatuses = COACH_ACTIONS_STATUSES;
  coachSpecialties = COACH_ACTIONS_SPECIALITIES;
  selectTeams$ = this.playerService.teams$;

  constructor(
    private teamPageService: TeamPageService,
    private playerService: PlayerService,
    private coachService: CoachService,
    private currentUserService: CurrentUserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject('apiUrl') private apiUrl: string,
    private imageInspectorService: ImageInspectorService,
    public dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        map((params) => params['id']),
        switchMap((id) => {
          console.log(id);
          if (!id) {
            this.router.navigate(['/not-found']);
            return EMPTY;
          }
          return this.teamPageService.loadTeam$(id);
        }),
        untilDestroyed(this),
      )
      .subscribe((teamDetail) => {
        this.team = teamDetail;
      });
  }

  fillCreatePlayerForm() {
    this.initializePlayerActionsForm();
    this.playerActionsForm.controls.firstName.setValue('');
    this.playerActionsForm.controls.lastName.setValue('');
    this.playerActionsForm.controls.birthDay.setValue(
      moment().subtract(18, 'year').toDate(),
    );
    this.playerActionsForm.controls.country.setValue({
      name: 'Ukraine',
      alpha2Code: 'UA',
      alpha3Code: 'UKR',
      numericCode: '804',
      callingCode: '+380',
    });
    this.playerActionsForm.controls.height.setValue(1.01);
    this.playerActionsForm.controls.weight.setValue(50.01);
    this.selectTeams$
      .pipe(
        map((teams) => teams?.find((team) => team.id === this.team.id)),
        take(1),
        untilDestroyed(this),
      )
      .subscribe((team) => {
        this.playerActionsForm.controls.team.setValue(team ? team : null);
      });
    this.playerActionsForm.controls.jerseyNumber.setValue(0);
    this.playerActionsForm.controls.position.setValue('Guard');
    this.playerActionsForm.controls.experiences.setValue([]);
  }

  fillUpdatePlayerForm(player: Player) {
    this.initializePlayerActionsForm();
    this.playerActionsForm.controls.id.setValue(player.id);
    this.playerActionsForm.controls.firstName.setValue(player.firstName);
    this.playerActionsForm.controls.lastName.setValue(player.lastName);
    this.playerActionsForm.controls.birthDay.setValue(player.dateOfBirth);

    this.setValue(this.playerActionsForm.controls.country, player.country);
    this.playerActionsForm.controls.height.setValue(player.height);
    this.playerActionsForm.controls.weight.setValue(player.weight);
    this.selectTeams$
      .pipe(
        map((teams) => teams?.find((team) => team.id === player.teamId)),
        take(1),
        untilDestroyed(this),
      )
      .subscribe((team) => {
        this.playerActionsForm.controls.team.setValue(team ? team : null);
      });
    this.playerActionsForm.controls.jerseyNumber.setValue(player.jerseyNumber);
    this.playerActionsForm.controls.position.setValue(player.position);
    this.playerActionsForm.controls.experiences.setValue([]);
    const avatarUrl = this.apiUrl + `/players/${player.id}/avatar`;

    this.imageInspectorService
      .checkImageURL(avatarUrl)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((exists) => {
        const avatarValue = exists ? avatarUrl : null;
        this.playerActionsForm.controls.avatar.setValue(avatarValue);
      });
  }

  fillCreateCoachForm() {
    this.initializeCoachActionsForm();
    this.coachActionsForm.controls.id.setValue('');
    this.coachActionsForm.controls.firstName.setValue('');
    this.coachActionsForm.controls.lastName.setValue('');
    this.coachActionsForm.controls.birthDay.setValue(
      moment().subtract(18, 'year').toDate(),
    );
    this.coachActionsForm.controls.country.setValue({
      name: 'Ukraine',
      alpha2Code: 'UA',
      alpha3Code: 'UKR',
      numericCode: '804',
      callingCode: '+380',
    });
    this.selectTeams$
      .pipe(
        map((teams) => teams?.find((team) => team.id === this.team.id)),
        take(1),
        untilDestroyed(this),
      )
      .subscribe((team) => {
        this.coachActionsForm.controls.team.setValue(team ? team : null);
      });
    this.coachActionsForm.controls.coachStatus.setValue(
      this.coachStatuses[0].value,
    );
    this.coachActionsForm.controls.specialty.setValue(
      this.coachSpecialties[0].value,
    );
    this.coachActionsForm.controls.experiences.setValue([]);
  }

  fillUpdateCoachForm(coach: Coach) {
    this.initializeCoachActionsForm();
    this.coachActionsForm.controls.id.setValue(coach.id);
    this.coachActionsForm.controls.firstName.setValue(coach.firstName);
    this.coachActionsForm.controls.lastName.setValue(coach.lastName);
    this.coachActionsForm.controls.birthDay.setValue(coach.dateOfBirth);

    this.setValue(this.coachActionsForm.controls.country, coach.country);
    this.coachActionsForm.controls.specialty.setValue(coach.specialty);
    this.coachActionsForm.controls.coachStatus.setValue(coach.coachStatus);
    this.selectTeams$
      .pipe(
        map((teams) => teams?.find((team) => team.id === coach.teamId)),
        take(1),
        untilDestroyed(this),
      )
      .subscribe((team) => {
        this.coachActionsForm.controls.team.setValue(team ? team : null);
      });
    this.coachActionsForm.controls.experiences.setValue([]);
    const avatarUrl = this.apiUrl + `/teams/coaches/${coach.id}/avatar`;

    this.imageInspectorService
      .checkImageURL(avatarUrl)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((exists) => {
        const avatarValue = exists ? avatarUrl : null;
        this.coachActionsForm.controls.avatar.setValue(avatarValue);
      });
  }

  initializePlayerActionsForm() {
    this.playerActionsForm = new FormGroup<PlayerActionsForm>({
      id: new FormControl(''),
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_PATTERN),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_PATTERN),
      ]),
      birthDay: new FormControl(null, [
        Validators.required,
        dateValidator(moment().subtract(18, 'years').toDate(), 'max'),
      ]),
      country: new FormControl(null, Validators.required),
      height: new FormControl(1.01, [
        Validators.required,
        Validators.min(1.01),
      ]),
      weight: new FormControl(50.01, [
        Validators.required,
        Validators.min(50.01),
      ]),
      team: new FormControl(null),
      position: new FormControl('', Validators.required),
      jerseyNumber: new FormControl(0, [
        Validators.required,
        Validators.min(0),
      ]),
      experiences: new FormArray<FormGroup<StaffExperienceForm>>([]),
      avatar: new FormControl(null),
    });
  }

  initializeCoachActionsForm() {
    this.coachActionsForm = new FormGroup<CoachActionsForm>({
      id: new FormControl(''),
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_PATTERN),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_PATTERN),
      ]),
      birthDay: new FormControl(null, [
        Validators.required,
        dateValidator(moment().subtract(18, 'years').toDate(), 'max'),
      ]),
      country: new FormControl(null, Validators.required),
      team: new FormControl(null),
      coachStatus: new FormControl('', Validators.required),
      specialty: new FormControl('', Validators.required),
      experiences: new FormArray<FormGroup<CoachExperienceForm>>([]),
      avatar: new FormControl(null),
    });
  }

  setValue(control: AbstractControl, countryName: string) {
    const country = this.countries.find((x) => x.name == countryName);
    control.setValue(country ? country : null);
  }

  onDeletePlayerClicked(player: Player): void {
    const dialogData: DialogData = {
      title: 'Confirm Action',
      message: `Are you sure you want to delete ${player.lastName + ' ' + player.firstName}?`,
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => this.playerService.deletePlayer$(player.id)),
        switchMap(() => this.teamPageService.loadTeam$(this.team.id)),
        untilDestroyed(this),
      )
      .subscribe((team) => {
        this.team = team;
      });
  }

  onDeleteCoachClicked(coach: Coach): void {
    const dialogData: DialogData = {
      title: 'Confirm Action',
      message: `Are you sure you want to delete ${coach.lastName + ' ' + coach.firstName}?`,
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => this.coachService.deleteCoach$(coach.id)),
        switchMap(() => this.teamPageService.loadTeam$(this.team.id)),
        untilDestroyed(this),
      )
      .subscribe((team) => {
        this.team = team;
      });
  }

  handleUpdatePlayer(eventData: {
    id: string;
    playerDto: PlayerRequestDto;
    playerImage: File | null | undefined;
  }) {
    this.playerService
      .updatePlayer$(eventData.id, eventData.playerDto, eventData.playerImage)
      .pipe(
        switchMap(() => this.teamPageService.loadTeam$(this.team.id)),
        untilDestroyed(this),
      )
      .subscribe((team) => {
        this.team = team;
      });
  }

  handleCreatePlayer(eventData: {
    playerDto: PlayerRequestDto;
    playerImage: File | null | undefined;
  }) {
    this.playerService
      .createPlayer$(eventData.playerDto, eventData.playerImage)
      .pipe(
        switchMap(() => this.teamPageService.loadTeam$(this.team.id)),
        untilDestroyed(this),
      )
      .subscribe((team) => {
        this.team = team;
      });
  }

  handleUpdateCoach(eventData: {
    id: string;
    coachDto: CoachRequestDto;
    coachImage: File | null | undefined;
  }) {
    this.coachService
      .updateCoach$(eventData.id, eventData.coachDto, eventData.coachImage)
      .pipe(
        switchMap(() => this.teamPageService.loadTeam$(this.team.id)),
        untilDestroyed(this),
      )
      .subscribe((team) => {
        this.team = team;
      });
  }

  handleCreateCoach(eventData: {
    coachDto: CoachRequestDto;
    coachImage: File | null | undefined;
  }) {
    this.coachService
      .createCoach$(eventData.coachDto, eventData.coachImage)
      .pipe(
        switchMap(() => this.teamPageService.loadTeam$(this.team.id)),
        untilDestroyed(this),
      )
      .subscribe((team) => {
        this.team = team;
      });
  }

  isAdminUser() {
    return this.currentUserService.isAdminOrSuperAdmin();
  }

  onError(event: Event) {
    (event.target as HTMLImageElement).src = `assets/images/default-team.png`;
  }
}
