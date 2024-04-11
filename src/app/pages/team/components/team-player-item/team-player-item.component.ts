import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from '../../../../core/interfaces/player/player.model';

@Component({
  selector: 'app-team-player-item',
  templateUrl: './team-player-item.component.html',
  styleUrl: './team-player-item.component.scss',
})
export class TeamPlayerItemComponent {
  @Input() player!: Player;
  @Input() isAdmin: boolean = false;
  @Output() deleteRequest = new EventEmitter<Player>();
  @Output() updateRequest = new EventEmitter<Player>();

  onDeleteClicked() {
    this.deleteRequest.emit(this.player!);
  }

  onUpdateClicked() {
    this.updateRequest.emit(this.player!);
  }

  onError(event: Event) {
    (event.target as HTMLImageElement).src = `assets/images/empty-staff.jpg`;
  }
}
