import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../../../core/interfaces/player/player.model';

@Pipe({
  name: 'playerTeamName',
})
export class PlayerTeamNamePipe implements PipeTransform {
  transform(player: Player): string {
    if (player.teamName) {
      return player.teamName;
    }
    return '-';
  }
}
