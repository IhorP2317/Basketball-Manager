import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Coach } from '../../../../core/interfaces/coach/coach.model';

@Component({
  selector: 'app-team-coach-item',
  templateUrl: './team-coach-item.component.html',
  styleUrl: './team-coach-item.component.scss',
})
export class TeamCoachItemComponent {
  @Input() coach!: Coach;
  @Input() isAdmin: boolean = false;
  @Output() deleteRequest = new EventEmitter<Coach>();
  @Output() updateRequest = new EventEmitter<Coach>();

  onDeleteClicked() {
    this.deleteRequest.emit(this.coach!);
  }

  onUpdateClicked() {
    this.updateRequest.emit(this.coach!);
  }

  onError(event: Event) {
    (event.target as HTMLImageElement).src = `assets/images/empty-staff.jpg`;
  }
}
