import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import {AppHeaderComponent} from './app-header/app-header.component';
import {HttpClientModule} from "@angular/common/http";
import {NavigationTapGroupComponent} from './navigation-tap-group/navigation-tap-group.component';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTabsModule} from "@angular/material/tabs";
import { PaginatorComponent } from './paginator/paginator.component';
import {MatPaginator} from "@angular/material/paginator";
import { ConfirmationDialogComponent } from './dialog/confirmation-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";

@NgModule({
  declarations: [
    AppHeaderComponent,
    NavigationTapGroupComponent,
    PaginatorComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    RouterOutlet,
    MatPaginator,
    MatDialogModule
  ],
  exports: [
    AppHeaderComponent,
    NavigationTapGroupComponent,
    PaginatorComponent,
  ],
})
export class SharedComponentsModule {}
