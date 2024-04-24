import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AlertService } from '../../services/alert.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AvatarComponent,
    },
  ],
})
export class AvatarComponent implements OnInit, ControlValueAccessor {
  imageUrl: string = '';
  currentImage?: File | null;
  @Output() handleFileChange = new EventEmitter<File>();

  constructor(
    public dialog: MatDialog,
    private alertService: AlertService,
  ) {}

  onChange = (url: string) => {};

  writeValue(url: string | null): void {
    if (url) {
      this.imageUrl = url;
    } else {
      this.imageUrl = '';
    }
  }

  onTouched = () => {};
  disabled: boolean = false;

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit(): void {
    console.log(this.imageUrl);
  }

  onFileChange(event: any) {
    const files = event.target.files as FileList;

    if (files.length > 0) {
      const file = files[0];
      const fileUrl = URL.createObjectURL(file);
      this.resetInput();
      if (this.validateFileInput(file.name)) {
        this.openAvatarEditor(fileUrl)
          .pipe(untilDestroyed(this))
          .subscribe((croppedFile) => {
            if (croppedFile) {
              this.imageUrl = URL.createObjectURL(croppedFile);
              this.onChange(croppedFile);
              this.handleFileChange.emit(croppedFile);
            }
          });
      }
    }
  }

  openAvatarEditor(image: string): Observable<any> {
    const dialogRef = this.dialog.open(ImageCropperComponent, {
      maxWidth: '80vw',
      maxHeight: '80vh',
      data: image,
    });

    return dialogRef.afterClosed();
  }

  resetInput() {
    const input = document.getElementById(
      'avatar-input-file',
    ) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  validateFileInput(fileName: string) {
    let allowedExtensions =
      /\.(jpe?g|png|ico|gif|bmp|tiff?|jtiff|xbm|svgz?|webp|avif)$/i;

    if (!allowedExtensions.exec(fileName)) {
      this.alertService.error(
        'Invalid file type. Please choose a valid image file.',
      );
      return false;
    }

    return true;
  }
}
