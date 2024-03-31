import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsComponent } from './teams.component';
import {RouterModule} from "@angular/router";

import { TeamItemComponent } from './components/team-item/team-item.component';
import {SharedComponentsModule} from "../../shared/components/shared-components.module";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [TeamsComponent, TeamItemComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: TeamsComponent }]),
    SharedComponentsModule,
    MatIcon,
    MatIconButton,
    MatTooltip,
    MatFormField,
    MatInput,
    FormsModule,
  ],
})
export class TeamsModule {}
