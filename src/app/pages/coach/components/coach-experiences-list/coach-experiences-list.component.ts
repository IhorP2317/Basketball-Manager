import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CoachExperienceDetail } from '../../../../core/interfaces/staff-experience/coach-experience-detail.model';

@Component({
  selector: 'app-coach-experiences-list',
  templateUrl: './coach-experiences-list.component.html',
  styleUrl: './coach-experiences-list.component.scss',
})
export class CoachExperiencesListComponent {
  @Input() coachExperiences!: CoachExperienceDetail[];
  @Input() isAdmin: boolean = true;
  @Output() deleteRequest = new EventEmitter<string>();
  @Output() updateRequest = new EventEmitter<CoachExperienceDetail>();
  @Output() createRequest = new EventEmitter<void>();

  onDeleteClicked(coachExperienceId: string) {
    this.deleteRequest.emit(coachExperienceId);
  }

  onUpdateClicked(coachExperience: CoachExperienceDetail) {
    this.updateRequest.emit(coachExperience);
  }

  onCreateClicked() {
    this.createRequest.emit();
  }

  onError(event: Event) {
    (event.target as HTMLImageElement).src = `assets/images/default-team.png`;
  }
}
