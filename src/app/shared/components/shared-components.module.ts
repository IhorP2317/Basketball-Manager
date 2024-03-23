import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import {AppHeaderComponent} from './app-header/app-header.component';
import {HttpClientModule} from "@angular/common/http";
import {NavigationTapGroupComponent} from './navigation-tap-group/navigation-tap-group.component';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";

@NgModule({
  declarations: [
    AppHeaderComponent,
    NavigationTapGroupComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    RouterOutlet
  ],
  exports: [
    AppHeaderComponent,
    NavigationTapGroupComponent
  ]
})
export class SharedComponentsModule {
}
