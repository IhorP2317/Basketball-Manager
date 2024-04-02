import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Team } from '../../../../core/interfaces/team/team.model';

@Component({
  selector: 'app-team-item',
  templateUrl: './team-item.component.html',
  styleUrl: './team-item.component.scss',
})
export class TeamItemComponent {
  @Input() team?: Team | null;
  @Output() deleteRequest = new EventEmitter<Team>();

  constructor(@Inject('apiUrl') private baseUrl: string) {}

  onDeleteClicked() {
    this.deleteRequest.emit(this.team!);
  }

  getImageSrc(teamId: string): string {
    if (teamId) {
      return `${this.baseUrl}/teams/${teamId}/avatar`;
    }
    return `assets/images/default-team.png`;
  }

  onError(event: Event) {
    (event.target as HTMLImageElement).src = `assets/images/default-team.png`;
  }
}
