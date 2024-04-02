import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersComponent } from './players.component';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { PlayerItemComponent } from './components/player-item/player-item.component';
import { SharedComponentsModule } from '../../shared/components/shared-components.module';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { FormsModule } from '@angular/forms';
import { PlayerImageSrcPipe } from './pipes/player-image-src.pipe';
import { PlayerTeamNamePipe } from './pipes/player-team-name.pipe';

@NgModule({
  declarations: [
    PlayersComponent,
    PlayerItemComponent,
    PlayerImageSrcPipe,
    PlayerTeamNamePipe,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: PlayersComponent }]),
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    MatButton,
    SharedComponentsModule,
    HttpClientModule,
    MatSelectCountryModule,
    FormsModule,
  ],
})
export class PlayersModule {}
