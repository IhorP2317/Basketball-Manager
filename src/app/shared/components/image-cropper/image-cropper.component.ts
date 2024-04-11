import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import Cropper from 'cropperjs';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrl: './image-cropper.component.scss',
})
export class ImageCropperComponent implements OnInit {
  sanitizedUrl!: SafeUrl;
  cropper!: Cropper;
  croppedImage!: File;

  constructor(
    public dialogRef: MatDialogRef<ImageCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public image: string,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.image);
  }

  ngAfterViewInit() {
    this.initCropper();
  }

  initCropper() {
    const image = document.getElementById('image') as HTMLImageElement;
    this.cropper = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 1,
      guides: false,
    });
  }

  getRoundedCanvas(sourceCanvas: any) {
    let canvas = document.createElement('canvas');
    let context: any = canvas.getContext('2d');
    let width = sourceCanvas.width;
    let height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.arc(
      width / 2,
      height / 2,
      Math.min(width, height) / 2,
      0,
      2 * Math.PI,
      true,
    );
    context.fill();
    return canvas;
  }

  crop() {
    const croppedCanvas = this.cropper.getCroppedCanvas();
    const roundedCanvas = this.getRoundedCanvas(croppedCanvas);

    roundedCanvas.toBlob((blob) => {
      if (blob) {
        this.croppedImage = new File([blob], 'avatar.png', {
          type: 'image/png',
        });

        this.dialogRef.close(this.croppedImage);
      } else {
        this.dialogRef.close(null);
      }
    }, 'image/png');
  }

  reset() {
    this.cropper.clear();
    this.cropper.crop();
  }
}
