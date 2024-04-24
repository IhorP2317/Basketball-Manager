import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TeamActionsForm } from '../../../../core/interfaces/forms/team/team-actions-form';
import { TeamDto } from '../../../../core/interfaces/team/team.dto';

@Component({
  selector: 'app-create-and-edit-team',
  templateUrl: './create-and-edit-team.component.html',
  styleUrl: './create-and-edit-team.component.scss',
})
export class CreateAndEditTeamComponent {
  @Input() form!: FormGroup<TeamActionsForm>;
  @Input() action!: 'Create' | 'Edit';
  @Output() closed = new EventEmitter<void>();
  @Output() createRequested = new EventEmitter<{
    teamDto: TeamDto;
    teamImage: File | null | undefined;
  }>();
  @Output() updateRequested = new EventEmitter<{
    id: string;
    teamDto: TeamDto;
    teamImage: File | null | undefined;
  }>();
  teamImage!: File;
  errorMessage: string | null = null;

  constructor() {}

  onSubmit() {
    console.log(this.teamImage);
    if (this.action === 'Create') {
      this.createPlayer();
    } else if (this.action === 'Edit') {
      this.updatePlayer();
    }
  }

  createPlayer() {
    if (this.form.valid) {
      const teamDto: TeamDto = {
        name: this.form.value.name!,
      };
      this.createRequested.emit({
        teamDto: teamDto,
        teamImage: this.teamImage,
      });
      this.closed.emit();
    }
  }

  updatePlayer() {
    if (this.form.valid) {
      const teamDto: TeamDto = {
        name: this.form.value.name!,
      };
      this.updateRequested.emit({
        id: this.form.value.id!,
        teamDto: teamDto,
        teamImage: this.teamImage,
      });
      this.closed.emit();
    }
  }

  handleImageFile(image: File) {
    this.teamImage = image;
  }
}
