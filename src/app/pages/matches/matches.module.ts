import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesComponent } from './matches.component';
import {RouterModule} from "@angular/router";
import { MatchesListComponent } from './components/matches-list/matches-list.component';





@NgModule({
  declarations: [
    MatchesComponent,
    MatchesListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: "", component: MatchesComponent}])
  ]
})
export class MatchesModule { }
