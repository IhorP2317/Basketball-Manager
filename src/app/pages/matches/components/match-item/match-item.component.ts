import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Match } from '../../../../core/interfaces/match/match.model';

@Component({
  selector: 'match-item',
  templateUrl: './match-item.component.html',
  styleUrl: './match-item.component.scss',
})
export class MatchItemComponent {
  @Input() match?: Match;
  @Input() isAdmin: boolean = false;
  @Output() deleteRequest = new EventEmitter<string>();
  @Output() updateRequest = new EventEmitter<Match>();

  constructor(@Inject('apiUrl') private baseUrl: string) {}

  onDeleteClicked() {
    this.deleteRequest.emit(this.match?.id);
  }

  onUpdateClicked() {
    this.updateRequest.emit(this.match);
  }

  printStatisticRoute() {
    const statisticRoute = this.match?.id
      ? `${this.match.id}/statistic`
      : 'Invalid route';
    console.log(statisticRoute);
  }

  onError(event: Event, team: 'home' | 'away') {
    (event.target as HTMLImageElement).src =
      `assets/images/${team === 'home' ? 'HomeTeam.png' : 'AwayTeam.png'}`;
  }
}
