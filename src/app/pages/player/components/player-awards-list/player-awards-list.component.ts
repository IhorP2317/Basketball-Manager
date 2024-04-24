import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PlayerExperienceDetail } from '../../../../core/interfaces/staff-experience/player-experience-detail.model';

@Component({
  selector: 'app-player-awards-list',
  templateUrl: './player-awards-list.component.html',
  styleUrl: './player-awards-list.component.scss',
})
export class PlayerAwardsListComponent {
  @Input() playerExperiences!: PlayerExperienceDetail[];
  @Input() isAdmin: boolean = true;
  @Output() deleteRequest = new EventEmitter<string>();
  @Output() createRequest = new EventEmitter<void>();

  get hasAwards(): boolean {
    return this.playerExperiences.some(
      (experience) =>
        experience.playerAwards && experience.playerAwards.length > 0,
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
