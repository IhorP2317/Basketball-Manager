import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../core/interfaces/user/user.model';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss',
})
export class UserItemComponent {
  @Input() public user?: User | null;
  @Output() deleteRequest = new EventEmitter<User>();

  OnDeleteClicked() {
    this.deleteRequest.emit(this.user!);
  }

  onError(event: Event) {
    (event.target as HTMLImageElement).src = `assets/images/empty-staff.jpg`;
  }
}
