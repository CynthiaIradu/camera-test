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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
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
      console.log("permission granted")
      this.dialog.open(this.permissionGrantedDialog,{})
    } catch (error) {
        console.error('Error:', error);
    }
}

 

async requestPermission(): Promise<void> {
    try {
        // Request permission to access the camera
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio:false });
        return Promise.resolve()
         // stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately to release the camera
    } catch (error) {
        console.error('Error requesting permission:', error);
        return Promise.reject()
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
      data: { stream: this.stream },
    });
    dialogRef.afterClosed().subscribe((photo) => {
      if (photo) {
        console.log(photo);
      }
    });
  }
}
