import { Component, Inject, OnInit } from '@angular/core';
import { PLAYER_FILTER_POSITIONS } from '../../shared/constants/selectOption.constant';
import { Player } from '../../core/interfaces/player/player.model';
import { PagedListConfiguration } from '../../core/interfaces/paged-list/paged-list-configuration.dto';
import { PlayerService } from '../../shared/services/player.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../core/interfaces/dialog/dialog-data';
import { ConfirmationDialogComponent } from '../../shared/components/dialog/confirmation-dialog.component';
import { debounceTime, distinctUntilChanged, filter, map, take } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { PlayerActionsForm } from '../../core/interfaces/forms/player/player-actions-form';
import { NAME_PATTERN } from '../../shared/constants/form.constant';
import { dateValidator } from '../../shared/validators/form-validators';
import moment from 'moment/moment';
import { PlayerExperienceForm } from '../../core/interfaces/forms/player-experience/player-experience-form';
import {
  COUNTRIES_DB,
  Country,
} from '@angular-material-extensions/select-country';
import { ImageInspectorService } from '../../shared/services/image-inspector.service';

@UntilDestroy()
@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss',
})
export class PlayersComponent implements OnInit {
  countries: Country[] = COUNTRIES_DB;
  playerFiltersForm!: FormGroup;
  playerActionsForm!: FormGroup<PlayerActionsForm>;
  positions = PLAYER_FILTER_POSITIONS;
  currentSortColumn: string = 'default';
  isDescendingSortingOrder = false;
  selectTeams$ = this.playersPageService.teams$;
  playerPagedList$ = this.playersPageService.pagedListPlayers$;

  constructor(
    private fb: FormBuilder,
    private playersPageService: PlayerService,
    private currentUserService: CurrentUserService,
    private imageInspectorService: ImageInspectorService,
    public dialog: MatDialog,
    @Inject('apiUrl') private apiUrl: string,
  ) {
    this.playerFiltersForm = this.fb.group({
      team: ['All teams'],
      position: ['All positions'],
      country: [null],
      searchedPlayer: [''],
    });
  }

  fillCreatePlayerForm() {
    this.initializeActionsForm();
    this.playerActionsForm.controls.id.setValue('');
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
    this.playerActionsForm.controls.team.setValue(null);
    this.playerActionsForm.controls.jerseyNumber.setValue(0);
    this.playerActionsForm.controls.position.setValue('Guard');
    this.playerActionsForm.controls.experiences.setValue([]);
  }

  fillUpdatePlayerForm(player: Player) {
    this.initializeActionsForm();
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
    const avatarUrl = `/players/${player.id}/avatar`;

    this.imageInspectorService
      .checkImageURL(avatarUrl)
      .pipe(take(1), untilDestroyed(this))
      .subscribe((exists) => {
        const avatarValue = exists ? this.apiUrl + avatarUrl : null;
        console.log(avatarValue);
        this.playerActionsForm.controls.avatar.setValue(avatarValue);
      });
  }

  initializeActionsForm() {
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
      experiences: new FormArray<FormGroup<PlayerExperienceForm>>([]),
      avatar: new FormControl(null),
    });
  }

  setValue(control: AbstractControl, countryName: string) {
    const country = this.countries.find((x) => x.name == countryName);
    control.setValue(country ? country : null);
  }

  ngOnInit(): void {
    this.onTeamFiltersChange();
  }

  isAdminUser(): boolean {
    return this.currentUserService.isAdminOrSuperAdmin();
  }

  onTeamFiltersChange() {
    this.playerFiltersForm
      .get('team')
      ?.valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((team) => {
        this.playersPageService.setSelectedTeam(
          team === 'All teams' ? null : team,
        );
      });
    this.playerFiltersForm
      .get('position')
      ?.valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((position) => {
        this.playersPageService.setSelectedPosition(
          position === 'All positions' ? null : position,
        );
      });
    this.playerFiltersForm
      .get('country')
      ?.valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((country) => {
        this.playersPageService.setSelectedCountry(
          country ? country.name : null,
        );
      });
    this.playerFiltersForm
      .get('searchedPlayer')
      ?.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        untilDestroyed(this),
      )
      .subscribe((searchedPlayer: string) => {
        this.playersPageService.setSearchedPlayer(
          searchedPlayer.trim().length ? searchedPlayer.trim() : null,
        );
      });
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
        untilDestroyed(this),
      )
      .subscribe(() => this.playersPageService.deletePlayer(player.id));
  }

  onSortColumnClicked(sortColumn: string) {
    if (this.currentSortColumn === sortColumn) {
      this.isDescendingSortingOrder = !this.isDescendingSortingOrder;
    } else {
      this.isDescendingSortingOrder = false;
    }
    this.currentSortColumn = sortColumn;
    this.playersPageService.changeSortingSettings(
      sortColumn,
      this.isDescendingSortingOrder,
    );
  }

  onPageChangedEvent(pagingConfiguration: PagedListConfiguration) {
    this.playersPageService.changePagedListSettings(pagingConfiguration);
  }
}
