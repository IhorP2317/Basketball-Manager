import {Component, Input} from '@angular/core';
import {Player} from "../../../../core/interfaces/player/player.model";

@Component({
  selector: 'app-player-item',
  templateUrl: './player-item.component.html',
  styleUrl: './player-item.component.scss'
})
export class PlayerItemComponent {
@Input() player?:Player | null;
}
