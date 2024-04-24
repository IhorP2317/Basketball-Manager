import { FormControl } from '@angular/forms';
import { PlayerExperienceDetail } from '../../staff-experience/player-experience-detail.model';

export interface StatisticActionsForm {
  matchId: FormControl<string | null>;
  playerExperience: FormControl<PlayerExperienceDetail | null>;
  timeUnit: FormControl<number | null>;
  onePointShotHitCount: FormControl<number | null>;
  onePointShotMissCount: FormControl<number | null>;
  twoPointShotHitCount: FormControl<number | null>;
  twoPointShotMissCount: FormControl<number | null>;
  threePointShotHitCount: FormControl<number | null>;
  threePointShotMissCount: FormControl<number | null>;
  assistCount: FormControl<number | null>;
  offensiveReboundCount: FormControl<number | null>;
  defensiveReboundCount: FormControl<number | null>;
  stealCount: FormControl<number | null>;
  blockCount: FormControl<number | null>;
  turnoverCount: FormControl<number | null>;
  minutes: FormControl<number | null>;
  seconds: FormControl<number | null>;
}
