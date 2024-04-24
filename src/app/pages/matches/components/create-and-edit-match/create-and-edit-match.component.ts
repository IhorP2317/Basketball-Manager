import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatchActionsForm } from '../../../../core/interfaces/forms/match/match-actions-form';
import { MatchRequestDto } from '../../../../core/interfaces/match/match-request.dto';
import moment from 'moment/moment';
import { MatchesPageService } from '../../services/matches.page.service';
import { MATCH_ACTIONS_STATUSES } from '../../../../shared/constants/selectOption.constant';
import { MatchUpdateDto } from '../../../../core/interfaces/match/match-update.dto';

@Component({
  selector: 'app-create-and-edit-match',
  templateUrl: './create-and-edit-match.component.html',
  styleUrl: './create-and-edit-match.component.scss',
})
export class CreateAndEditMatchComponent {
  @Input() form!: FormGroup<MatchActionsForm>;
  @Input() action!: 'Create' | 'Edit';
  @Output() closed = new EventEmitter<void>();
  @Output() createRequested = new EventEmitter<{
    matchDto: MatchRequestDto;
  }>();
  @Output() updateRequested = new EventEmitter<{
    id: string;
    matchDto: MatchUpdateDto;
  }>();

  errorMessage: string | null = null;
  selectTeams$ = this.matchesPageService.teams$;
  maxEndTimeDate = moment().toDate();
  statuses = MATCH_ACTIONS_STATUSES;
  minStartTimeDate = moment()
    .year(1891)
    .month('December')
    .date(1)
    .startOf('day')
    .toDate();

  constructor(private matchesPageService: MatchesPageService) {}

  onSubmit() {
    if (this.action === 'Create') {
      this.createMatch();
    } else if (this.action === 'Edit') {
      this.updateMatch();
    }
  }

  createMatch() {
    if (this.form.valid) {
      this.createRequested.emit({
        matchDto: this.buildMatchDto() as MatchRequestDto,
      });
      this.closed.emit();
    }
  }

  updateMatch() {
    if (this.form.valid) {
      this.updateRequested.emit({
        id: this.form.value.id!,
        matchDto: this.buildMatchDto() as MatchUpdateDto,
      });
      this.closed.emit();
    }
  }

  buildMatchDto(): MatchRequestDto | MatchUpdateDto {
    const baseDto = {
      location: this.form.value.location!,
      startTime: moment(this.form.value.startTime).format(
        'YYYY-MM-DD HH:mm:ss',
      ),
      endTime: this.form.value.endTime
        ? moment(this.form.value.endTime).format('YYYY-MM-DD HH:mm:ss')
        : null,
      sectionCount: this.form.value.sectionCount!,
      rowCount: this.form.value.rowCount!,
      seatCount: this.form.value.seatCount!,
      status: this.form.value.status!,
    };

    if (this.action === 'Create') {
      return {
        ...baseDto,
        homeTeamId: this.form.value.homeTeam!.id,
        awayTeamId: this.form.value.awayTeam!.id,
      };
    } else {
      return baseDto;
    }
  }
}
