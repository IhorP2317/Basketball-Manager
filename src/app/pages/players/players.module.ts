import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayersComponent } from './players.component';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import {
  MatButton,
  MatButtonModule,
  MatIconButton,
} from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { PlayerItemComponent } from './components/player-item/player-item.component';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlayerTeamNamePipe } from './pipes/player-team-name.pipe';
import { DataManagerCreateAndEditPlayerComponent } from './components/data-manager-create-and-edit-player/data-manager-create-and-edit-player.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    PlayersComponent,
    PlayerItemComponent,
    PlayerTeamNamePipe,
    DataManagerCreateAndEditPlayerComponent,
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
    SharedModule,
    HttpClientModule,
    MatSelectCountryModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    MatCardContent,
    MatCard,
  ],
  exports: [],
})
export class PlayersModule {}
