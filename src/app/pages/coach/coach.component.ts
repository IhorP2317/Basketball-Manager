import { Component, OnInit, ViewChild } from '@angular/core';
import { CoachDetail } from '../../core/interfaces/coach/coach-detail.model';
import { CoachPageService } from './services/coach.page.service';
import { CurrentUserService } from '../../shared/services/current-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { EMPTY, filter, map, switchMap, take } from 'rxjs';
import { CoachExperienceDto } from '../../core/interfaces/staff-experience/coach-experience.dto';
import { DialogData } from '../../core/interfaces/dialog/dialog-data';
import { ConfirmationDialogComponent } from '../../shared/components/dialog/confirmation-dialog.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CoachExperienceForm } from '../../core/interfaces/forms/staff-experience/coach-experience-form';
import {
  dateValidator,
  dateWithinExperienceRangeValidator,
} from '../../shared/validators/form-validators';
import moment from 'moment/moment';
import { COACH_ACTIONS_STATUSES } from '../../shared/constants/selectOption.constant';
import { PlayerService } from '../../shared/services/player.service';
import { CoachExperienceDetail } from '../../core/interfaces/staff-experience/coach-experience-detail.model';
import { StaffExperienceUpdateDto } from '../../core/interfaces/staff-experience/staff-experience-update.dto';
import { AwardActionsForm } from '../../core/interfaces/forms/award/award-actions-form';
import { NAME_PATTERN } from '../../shared/constants/form.constant';
import { AlertService } from '../../shared/services/alert.service';
import { AwardRequestDto } from '../../core/interfaces/awards/award-request.dto';
import { PopUpComponent } from '../../shared/components/pop-up/pop-up.component';

@UntilDestroy()
@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrl: './coach.component.scss',
  providers: [CoachPageService],
})
export class CoachComponent implements OnInit {
  @ViewChild('createAwardDialog') createAwardDialog!: PopUpComponent;
  coach!: CoachDetail;
  coachExperienceActionsForm!: FormGroup<CoachExperienceForm>;
  awardActionsForm!: FormGroup<AwardActionsForm>;
  coachStatuses = COACH_ACTIONS_STATUSES;
  selectTeams$ = this.playerService.teams$;

  constructor(
    private coachPageService: CoachPageService,
    private playerService: PlayerService,
    private currentUserService: CurrentUserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private alertService: AlertService,
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
          return this.coachPageService.loadCoach$(id);
        }),
        untilDestroyed(this),
      )
      .subscribe((coachDetail) => {
        this.coach = coachDetail;
        this.initializeCoachExperienceActionsForm();
        this.initializeAwardActionsForm();
      });
  }

  initializeCoachExperienceActionsForm() {
    this.coachExperienceActionsForm = new FormGroup<CoachExperienceForm>({
      id: new FormControl(null),
      team: new FormControl(null, [Validators.required]),
      startDate: new FormControl(null, [
        dateValidator(
          moment(this.coach.dateOfBirth).add(18, 'year').toDate(),
          'min',
        ),
      ]),
      endDate: new FormControl(null, dateValidator(moment().toDate(), 'max')),
      status: new FormControl(null, Validators.required),
    });
  }

  fillCreateCoachExperienceForm() {
    this.coachExperienceActionsForm.reset();
    this.coachExperienceActionsForm.controls.team.setValue(null);
    this.coachExperienceActionsForm.controls.startDate.setValue(
      moment(this.coach.dateOfBirth).add(18, 'year').toDate(),
    );
    this.coachExperienceActionsForm.controls.endDate.setValue(null);
    this.coachExperienceActionsForm.controls.status.setValue(
      this.coachStatuses[0].value,
    );
  }

  fillUpdateCoachExperienceForm(coachExperience: CoachExperienceDetail) {
    this.coachExperienceActionsForm.reset();
    this.coachExperienceActionsForm.controls.id.setValue(coachExperience.id);
    this.selectTeams$
      .pipe(
        map((teams) =>
          teams?.find((team) => team.id === coachExperience.teamId),
        ),
        take(1),
        untilDestroyed(this),
      )
      .subscribe((team) => {
        this.coachExperienceActionsForm.controls.team.setValue(
          team ? team : null,
        );
      });
    this.coachExperienceActionsForm.controls.startDate.setValue(
      coachExperience.startDate,
    );
    this.coachExperienceActionsForm.controls.endDate.setValue(
      coachExperience.endDate,
    );
    this.coachExperienceActionsForm.controls.status.setValue(
      coachExperience.status,
    );
  }

  initializeAwardActionsForm() {
    this.awardActionsForm = new FormGroup<AwardActionsForm>(
      {
        staffExperience: new FormControl(null, [Validators.required]),
        name: new FormControl('', [
          Validators.required,
          Validators.pattern(NAME_PATTERN),
        ]),
        isIndividualAward: new FormControl<boolean>(false, {
          nonNullable: true,
        }),
        date: new FormControl(null, [
          dateValidator(
            moment(this.coach.dateOfBirth).add(18, 'year').toDate(),
            'min',
          ),
        ]),
        avatar: new FormControl(null),
      },
      dateWithinExperienceRangeValidator,
    );
  }

  fillCreateAwardForm() {
    this.awardActionsForm.reset();
  }

  dialogOpen() {
    if (this.coach.coachExperiences.length < 1) {
      this.alertService.error(
        'Please create new experience in order to create new award!',
      );
    } else {
      this.fillCreateAwardForm();
      this.createAwardDialog.open();
    }
  }

  get isAdminUser() {
    return this.currentUserService.isAdminOrSuperAdmin();
  }

  onError(event: Event) {
    (event.target as HTMLImageElement).src = `assets/images/empty-staff.jpg`;
  }

  handleCreateCoachExperience(coachExperience: CoachExperienceDto) {
    this.coachPageService
      .createCoachExperience$(this.coach.id, coachExperience)
      .pipe(
        switchMap(() => this.coachPageService.loadCoach$(this.coach.id)),
        untilDestroyed(this),
      )
      .subscribe((coach) => (this.coach = coach));
  }

  handleUpdateCoachExperience(eventData: {
    coachExperienceId: string;
    coachExperienceUpdateDto: StaffExperienceUpdateDto;
  }) {
    this.coachPageService
      .updateCoachExperience$(
        eventData.coachExperienceId,
        eventData.coachExperienceUpdateDto,
      )
      .pipe(
        switchMap(() => this.coachPageService.loadCoach$(this.coach.id)),
        untilDestroyed(this),
      )
      .subscribe((coach) => (this.coach = coach));
  }

  onDeleteCoachExperienceClicked(coachExperienceId: string): void {
    const dialogData: DialogData = {
      title: 'Confirm Action',
      message: `Are you sure you want to delete this experience?`,
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() =>
          this.coachPageService.deleteCoachExperience$(coachExperienceId),
        ),
        switchMap(() => this.coachPageService.loadCoach$(this.coach.id)),
        untilDestroyed(this),
      )
      .subscribe((coach) => {
        this.coach = coach;
      });
  }

  onDeleteCoachAwardClicked(awardId: string): void {
    const coachExperience = this.coach.coachExperiences.find((experience) =>
      experience.coachAwards.some((award) => award.id === awardId),
    );

    if (!coachExperience) {
      this.alertService.error('Award not found.');
      return;
    }

    const dialogData: DialogData = {
      title: 'Confirm Action',
      message: `Are you sure you want to delete this award from ${this.coach.lastName + ' ' + this.coach.firstName}?`,
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() =>
          this.coachPageService.deleteCoachAward$(coachExperience.id, awardId),
        ),
        switchMap(() => this.coachPageService.loadCoach$(this.coach.id)),
        untilDestroyed(this),
      )
      .subscribe((coach) => {
        this.coach = coach;
      });
  }

  handleCreateCoachAward(eventData: {
    staffExperienceId: string;
    awardDto: AwardRequestDto;
    awardImage?: File | null | undefined;
  }) {
    this.coachPageService
      .createCoachAward$(
        eventData.staffExperienceId,
        eventData.awardDto,
        eventData.awardImage,
      )
      .pipe(
        switchMap(() => this.coachPageService.loadCoach$(this.coach.id)),
        untilDestroyed(this),
      )
      .subscribe((coach) => (this.coach = coach));
  }
}
