import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  Inject,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CameraDialogComponent } from './camera-dialog/camera-dialog.component';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

interface videoInput {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'cameraTest';
  notificationService: any;
  @ViewChild('camera') cameraInput!: HTMLInputElement;
  @ViewChild('cameraButton') cameraButton!: MatButton;
  @ViewChild('button') testButton!: MatButton;
  @ViewChild('permissionGrantedDialog')
  permissionGrantedDialog!: TemplateRef<any>;
  permissionGrantedDialogRef!: MatDialogRef<any>;
  hasPermission: string ='prompt';
  isMobile: boolean = false;
  stream!: MediaStream;
  cameraButtonClicked: boolean = false;
  videoInputs: videoInput[] = [];
  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private _platform: Object
  ) {}


  ngOnInit(): void {
    this.isCaptureAttributeSupported();
  }
  ngAfterViewInit(): void {
    this.CustomError.prototype = Object.create(Error.prototype);
    this.CustomError.prototype.constructor = this.CustomError;
  }
  onFileSelected(event: Event) {
    console.log(event);
  }

  handleClick() {
    document.getElementById('button')?.click();
    this.cameraButtonClicked = false;
    this.cd.detectChanges();
  }

  async requestPermission() {
    if (isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
       try {
        if(this.hasPermission == 'prompt'){
         await this.promptForCameraAccess()
        }else if(this.hasPermission == 'granted') {
         this.openCamera()
        }else if(this.hasPermission == 'denied'){
          throw new PermissionError("Don't have permissions")
        }       
      } catch (err: any) {
        if (err.name == 'NotAllowedError') {
          alert(
            'Unable to access your camera. Please give your browser access to camera and try again!'
          );
        } else {
          alert(err);
        }
      }
    } else {
      const errorMessage = 'Current browser is not supported';
      alert(errorMessage);
    }
  }

  CustomError(this: any,) {
    this.name = 'NotAllowedError';
   }
  
  async promptForCameraAccess() {
    try {
      let stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      stream.getTracks().forEach((track) => track.stop());
      this.hasPermission = 'granted';
      this.openCamera()
      this.cd.detectChanges();
      return Promise.resolve(true);
    } catch (error: any) {
      this.hasPermission = 'denied';
      this.cd.detectChanges();
      return Promise.reject();
    }
  }
 
  async isGeolocationPermissionGranted() {
    try {
      const permissionName = "camera" as PermissionName
      const result = await navigator.permissions.query({ name: permissionName });
      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async openCamera() {
    this.videoInputs = await this.emulatedDevices();
    if (this.isMobile) {
      this.permissionGrantedDialogRef = this.dialog.open(
        this.permissionGrantedDialog
      );
      document
        .getElementById('continueButton')
        ?.addEventListener('click', () => {
          this.permissionGrantedDialog.elementRef.nativeElement.close();
        });
      this.permissionGrantedDialogRef.beforeClosed().subscribe(() => {
        document
          .getElementById('continueButton')
          ?.removeEventListener('click', () => {
            this.permissionGrantedDialog.elementRef.nativeElement.close();
          });
      });
    } else {
      this.openDialog2();
    }
  }
  async emulatedDevices() {
    if (!navigator.mediaDevices?.enumerateDevices) {
      console.log('enumerateDevices() not supported.');
      return Promise.reject();
    } else {
      try {
        let devices = await navigator.mediaDevices.enumerateDevices();
        let videoInputs: videoInput[] = [];
        devices.forEach((device) => {
          // List cameras .
          if (device.kind == 'videoinput' && device.label) {
            videoInputs.push({
              value: device.deviceId,
              viewValue: device.label,
            });
          }
        });
        return Promise.resolve(videoInputs);
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }

  isCaptureAttributeSupported() {
    let input = document.createElement('input');
    if ('capture' in input) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  openDialog2() {
    let dialogRef = this.dialog.open(CameraDialogComponent, {
      data: { videoInputs: this.videoInputs },
    });
    dialogRef.afterClosed().subscribe((photo) => {
      if (photo) {
        console.log(photo);
      }
    });
  }
}
export class Error {
  message:string
  name:string
  constructor(message:string) {
    this.message = message;
    this.name = "Error"; // (different names for different built-in error classes)
   }
}

export class PermissionError extends Error {
  constructor(message: string) {
    super(message); // (1)
    this.name = "NotAllowedError"; // (2)
  }
}