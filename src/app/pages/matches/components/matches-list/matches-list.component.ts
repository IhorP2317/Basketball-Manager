import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Match } from '../../../../core/interfaces/match/match.model';

@Component({
  selector: 'matches-list',
  templateUrl: './matches-list.component.html',
  styleUrl: './matches-list.component.scss',
})
export class MatchesListComponent {
  @Input() listHeader!: string;
  @Input() matches: Match[] = [];
  @Input() isAdmin: boolean = false;
  @Output() deleteMatch = new EventEmitter<string>();
  @Output() updateMatch = new EventEmitter<Match>();

  onDeleteRequested(matchId: string) {
    this.deleteMatch.emit(matchId);
  }

  onUpdateRequested(match: Match) {
    this.updateMatch.emit(match);
  }
}
