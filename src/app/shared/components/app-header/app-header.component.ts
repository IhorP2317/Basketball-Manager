import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CurrentUserService } from '../../services/current-user.service';
import { User } from '../../../core/interfaces/user/user.model';
import { filter, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../../core/interfaces/dialog/dialog-data';
import { ConfirmationDialogComponent } from '../dialog/confirmation-dialog.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NavigationService } from '../../services/navigation.service';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
  public platformName: string = 'B - BALL DATA';
  public currentUser$: Observable<User | null>;
  showUserContent$ = this.navigationService.showUserContent$;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private currentUserService: CurrentUserService,
    public dialog: MatDialog,
    private navigationService: NavigationService,
  ) {
    this.currentUser$ = this.currentUserService.currentUser$;
    this.matIconRegistry.addSvgIcon(
      'ticket-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/icons/ticket.svg',
      ),
    );
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/empty-user.png';
  }

  onLogOutClicked() {
    const dialogData: DialogData = {
      title: 'Confirm Action',
      message: 'Are you sure you want to log out?',
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result),
        untilDestroyed(this),
      )
      .subscribe(() => this.currentUserService.logOut());
  }
}
