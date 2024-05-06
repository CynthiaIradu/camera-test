import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CameraDialogComponent } from './camera-dialog/camera-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatButton } from '@angular/material/button';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatDialogModule, CommonModule],
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

  hasPermission: boolean = false;
  isMobile: boolean = false;
  stream!: MediaStream;
  cameraButtonClicked: boolean = false;
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

        // Check if permission is already granted
        const isPermissionGranted = await this.checkPermission();
        if (!isPermissionGranted) {
            // If permission is not granted, request it
            await this.requestPermission();
        }else{
          this.hasPermission = true
          this.cd.detectChanges()
        }
       
        // Open the camera
        await this.openCamera();
    } catch (error) {
        console.error('Error:', error);
    }
}

async checkPermission(): Promise<boolean> {
    try {
        // Check if permission is already granted
        const mediaDevices = navigator.mediaDevices || ((navigator as any).mozGetUserMedia || (navigator as any).webkitGetUserMedia);
        if (!mediaDevices) {
            console.error('getUserMedia is not supported');
            return false;
        }

        // Enumerate devices to check camera access
        const devices = await mediaDevices.enumerateDevices();
        const isCameraAccessible = devices.some(device => device.kind === 'videoinput');

        return isCameraAccessible;
    } catch (error) {
        console.error('Error checking permission:', error);
        return false;
    }
}

async requestPermission(): Promise<void> {
    try {
        // Request permission to access the camera
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio:false });
        console.log(this.stream)
        // stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately to release the camera
    } catch (error) {
        console.error('Error requesting permission:', error);
        throw error; // Propagate the error
    }
}

async openCamera(): Promise<void> {
    try {
        // Trigger the button click to open the camera
        await new Promise(resolve => setTimeout(resolve, 15000));
       // Wait for a short duration to ensure permission is fully granted
       let button =  document.getElementById('button')
       if(button){
        button.innerHTML = 'test'
       }
    } catch (error) {
        console.error('Error opening camera:', error);
        throw error; // Propagate the error
    }
}


   async emulatedDevices():Promise<string[]>{
    let videoInput:string[] = []
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
         devices.forEach(function(device) {
            // Check if the device is a video input (i.e., camera)
            if (device.kind === 'videoinput') {
               videoInput.push(device.label)
             }
        });
     })
    .catch(function(error) {
        return Promise.reject(error)
    });
    return Promise.resolve(videoInput)

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
      data: { stream: this.stream },
    });
    dialogRef.afterClosed().subscribe((photo) => {
      if (photo) {
        console.log(photo);
      }
    });
  }
}
