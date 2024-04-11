import {
  Component,
  ContentChild,
  EventEmitter,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { PopUpContentDirective } from '../../directives/pop-up-content.directive';

@Component({
  selector: 'datamanager-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.scss',
})
export class PopUpComponent implements OnDestroy {
  protected dialogRef?: MatDialogRef<unknown>;

  @ViewChild(TemplateRef, { static: true })
  protected template!: TemplateRef<unknown>;

  @ContentChild(PopUpContentDirective, { static: true, read: TemplateRef })
  protected lazyTemplate?: TemplateRef<unknown>;

  @Output()
  readonly closed = new EventEmitter<void>();

  constructor(public dialog: MatDialog) {}

  ngOnDestroy() {
    this.close();
  }

  open() {
    if (this.dialogRef != null) {
      return;
    }

    this.dialogRef = this.dialog.open(this.lazyTemplate ?? this.template);

    this.listenCloseEvent(this.dialogRef);
  }

  close() {
    this.dialogRef?.close();
    this.dialogRef = undefined;
  }

  protected async listenCloseEvent(dialogRef: MatDialogRef<unknown>) {
    await firstValueFrom(dialogRef.afterClosed());
    this.closed.emit();
    this.close();
  }
}
