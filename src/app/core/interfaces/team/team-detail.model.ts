import { Player } from '../player/player.model';
import { BaseResponse } from '../base-response.model';
import { Coach } from '../coach/coach.model';

export interface TeamDetail extends BaseResponse {
  name: string;
  players: Player[];
  coaches: Coach[];
}
