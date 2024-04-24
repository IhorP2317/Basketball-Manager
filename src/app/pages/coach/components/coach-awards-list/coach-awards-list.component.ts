import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CoachExperienceDetail } from '../../../../core/interfaces/staff-experience/coach-experience-detail.model';

@Component({
  selector: 'app-coach-awards-list',
  templateUrl: './coach-awards-list.component.html',
  styleUrl: './coach-awards-list.component.scss',
})
export class CoachAwardsListComponent {
  @Input() coachExperiences!: CoachExperienceDetail[];
  @Input() isAdmin: boolean = true;
  @Output() deleteRequest = new EventEmitter<string>();
  @Output() createRequest = new EventEmitter<void>();

  get hasAwards(): boolean {
    return this.coachExperiences.some(
      (experience) =>
        experience.coachAwards && experience.coachAwards.length > 0,
    );
  }

  onDeleteClicked(awardId: string) {
    this.deleteRequest.emit(awardId);
  }

  onCreateClicked() {
    this.createRequest.emit();
  }

  onError(event: Event) {
    (event.target as HTMLImageElement).src = `assets/images/default-award.png`;
  }
}
