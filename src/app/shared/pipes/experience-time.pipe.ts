import { Pipe, PipeTransform } from '@angular/core';
import { PlayerExperienceDetail } from '../../core/interfaces/staff-experience/player-experience-detail.model';
import { CoachExperienceDetail } from '../../core/interfaces/staff-experience/coach-experience-detail.model';

@Pipe({
  name: 'experienceTime',
})
export class ExperienceTimePipe implements PipeTransform {
  transform(
    experience: CoachExperienceDetail | PlayerExperienceDetail,
  ): string {
    const startDateStr = this.formatDate(experience.startDate);
    const endDateStr = experience.endDate
      ? this.formatDate(experience.endDate)
      : 'Present';
    return `${startDateStr} - ${endDateStr}`;
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
