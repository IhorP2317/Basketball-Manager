import {Component, Input} from '@angular/core';
import {User} from "../../../../core/interfaces/user/user.model";

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss'
})
export class UserItemComponent {
 @Input() public user?:User | null;

}
