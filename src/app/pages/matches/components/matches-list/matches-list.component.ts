import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Match} from "../../../../core/interfaces/match/match.model";


@Component({
  selector: 'matches-list',
  templateUrl: './matches-list.component.html',
  styleUrl: './matches-list.component.scss',
})
export class MatchesListComponent {
  @Input() listHeader!: string;
  @Input() matches: Match[] = [];
  @Output() deleteMatch = new EventEmitter<string>();
  onDeleteRequested(matchId: string) {
    this.deleteMatch.emit(matchId);
  }
}
