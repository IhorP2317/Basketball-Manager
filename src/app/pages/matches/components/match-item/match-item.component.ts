import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Match } from '../../../../core/interfaces/match/match.model';
import { MatchesPageService } from '../../services/matches.page.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'match-item',
  templateUrl: './match-item.component.html',
  styleUrl: './match-item.component.scss',
})
export class MatchItemComponent {
  @Input() match?: Match;
  @Output() deleteRequest = new EventEmitter<string>();

  constructor(@Inject('apiUrl') private baseUrl: string) {}
  onDeleteClicked() {
    this.deleteRequest.emit(this.match?.id);
  }
  getImageSrc(teamId: string, team: 'home' | 'away'): string {
    if (teamId) {
      return `${this.baseUrl}/teams/${teamId}/avatar`;
    }
    return `../../../../../assets/images/${team === 'home' ? 'HomeTeam.png' : 'AwayTeam.png'}`;
  }
  onError(event: Event, team: 'home' | 'away') {
    (event.target as HTMLImageElement).src =
      `../../../../../assets/images/${team === 'home' ? 'HomeTeam.png' : 'AwayTeam.png'}`;
  }
}
