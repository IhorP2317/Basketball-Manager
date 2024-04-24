import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../core/interfaces/user/user.model';
import { CurrentUserService } from '../../../../shared/services/current-user.service';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.scss',
})
export class UserItemComponent {
  @Input() public user?: User | null;
  @Output() deleteRequest = new EventEmitter<User>();
  @Output() updateRequest = new EventEmitter<User>();

  constructor(private currentUserService: CurrentUserService) {}

  isUserCanEdit() {
    return this.currentUserService.isUserCanEdit(this.user!);
  }

  isUserCanRemove() {
    return this.currentUserService.isUserCanRemove(this.user!);
  }

  OnDeleteClicked() {
    this.deleteRequest.emit(this.user!);
  }

  onUpdateClicked() {
    this.updateRequest.emit(this.user!);
  }

  onError(event: Event) {
    (event.target as HTMLImageElement).src = `assets/images/empty-staff.jpg`;
  }
}
