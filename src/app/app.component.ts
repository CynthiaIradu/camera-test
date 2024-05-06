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
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

interface videoInput  {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatDialogModule, CommonModule, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'cameraTest';
  notificationService: any;
  @ViewChild('camera') cameraInput!: HTMLInputElement;
  @ViewChild('cameraButton') cameraButton!: MatButton;
  @ViewChild('button') testButton!: MatButton;
  @ViewChild('permissionGrantedDialog') permissionGrantedDialog!: TemplateRef<any>
  permissionGrantedDialogRef!:MatDialogRef<any>
  hasPermission: boolean = false;
  isMobile: boolean = false;
  stream!: MediaStream;
  cameraButtonClicked: boolean = false;
  videoInputs: any;
  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private _platform: Object
  ) {}
  ngAfterViewInit(): void {
   }

  ngOnInit(): void {
    this.isCaptureAttributeSupported();
  }

  onFileSelected(event: Event) {
    console.log(event);
  }

 
  handleClick(){
       document.getElementById('button')?.click()
      this.cameraButtonClicked = false;
      this.cd.detectChanges()
  }
 
  async openDialog() {
    try {
      await this.requestPermission();
      console.log("permission granted")
      this.dialog.open(this.permissionGrantedDialog,{})
    } catch (error) {
        console.error('Error:', error);
    }
}

 

async requestPermission(): Promise<void> {
  if (isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
    try {
      let stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      stream.getTracks().forEach(track => track.stop()); 

      this.videoInputs = await this.emulatedDevices()
       this.hasPermission = true;
      this.cd.detectChanges()
      if(this.isMobile){
        this.permissionGrantedDialogRef = this.dialog.open(this.permissionGrantedDialog,)
        this.permissionGrantedDialogRef.close()
      }else{
         this.openDialog()
      }
     } catch (error:any) {
      if(error.name == "NotAllowedError"){
        this.notificationService.error("Unable to access your camera. Please give your browser access to camera and try again!");
      }else{
        this.notificationService.error(error);

      }
     }
  } else {
    const errorMessage = 'Current browser is not supported';
    this.notificationService.error(errorMessage);
   }
}

async emulatedDevices(){
  if (!navigator.mediaDevices?.enumerateDevices) {
   console.log('enumerateDevices() not supported.');
    return Promise.reject()
 } else {
   try {
     let devices = await navigator.mediaDevices.enumerateDevices();
     let videoInputs:videoInput[] = []
     devices.forEach((device) => {
       // List cameras .
       if (device.kind == 'videoinput' && device.label) {
         videoInputs.push({ value: device.deviceId, viewValue: device.label });
       }
     });
     return Promise.resolve(videoInputs)
    } catch (err) {
      return Promise.reject(err)
   }
}}
  
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
      data: { stream: this.stream },
    });
    dialogRef.afterClosed().subscribe((photo) => {
      if (photo) {
        console.log(photo);
      }
    });
  }
}
