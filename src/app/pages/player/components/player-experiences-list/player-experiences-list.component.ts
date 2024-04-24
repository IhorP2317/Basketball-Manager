import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlayerExperienceDetail } from '../../../../core/interfaces/staff-experience/player-experience-detail.model';

@Component({
  selector: 'app-player-experiences-list',
  templateUrl: './player-experiences-list.component.html',
  styleUrl: './player-experiences-list.component.scss',
})
export class PlayerExperiencesListComponent {
  @Input() playerExperiences!: PlayerExperienceDetail[];
  @Input() isAdmin: boolean = true;
  @Output() deleteRequest = new EventEmitter<string>();
  @Output() updateRequest = new EventEmitter<PlayerExperienceDetail>();
  @Output() createRequest = new EventEmitter<void>();

  onDeleteClicked(playerExperienceId: string) {
    this.deleteRequest.emit(playerExperienceId);
  }

  onUpdateClicked(playerExperience: PlayerExperienceDetail) {
    this.updateRequest.emit(playerExperience);
  }

  onCreateClicked() {
    this.createRequest.emit();
  }

  onError(event: Event) {
    (event.target as HTMLImageElement).src = `assets/images/default-team.png`;
  }
}
