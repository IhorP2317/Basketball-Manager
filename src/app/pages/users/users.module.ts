import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import {RouterModule} from "@angular/router";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import { UserItemComponent } from './components/user-item/user-item.component';
import {MatTooltip} from "@angular/material/tooltip";
import {SharedComponentsModule} from "../../shared/components/shared-components.module";



@NgModule({
  declarations: [UsersComponent, UserItemComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: UsersComponent }]),
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconButton,
    MatTooltip,
    SharedComponentsModule,
  ],
})
export class UsersModule {}
