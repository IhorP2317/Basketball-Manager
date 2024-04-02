import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from '../../../../core/interfaces/player/player.model';

@Component({
  selector: 'app-player-item',
  templateUrl: './player-item.component.html',
  styleUrl: './player-item.component.scss',
})
export class PlayerItemComponent {
  @Input() player?: Player | null;
  @Output() deleteRequest = new EventEmitter<Player>();

  onDeleteClicked() {
    this.deleteRequest.emit(this.player!);
  }

  onError(event: Event) {
    (event.target as HTMLImageElement).src = `assets/images/empty-staff.jpg`;
  }
}
