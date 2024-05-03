import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CameraDialogComponent } from './camera-dialog/camera-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatDialogModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'cameraTest';
  notificationService: any;
  @ViewChild('camera') cameraInput!: HTMLInputElement;
  hasPermission: boolean = false;
  isMobile: boolean = false;
  stream!: MediaStream;
  constructor(
    public dialog: MatDialog,
    @Inject(PLATFORM_ID) private _platform: Object
  ) {}

  ngOnInit(): void {}

  onFileSelected(event: Event) {
    console.log(event);
  }

  async requestPermission() {
    if (isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
      try {
          this.stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
         return Promise.resolve()
      } catch (err) {
        alert(err)
        return Promise.reject(err)
      }
    } else {
      return Promise.reject()
    }
  }

  openDialog(){
    this.requestPermission().then(() =>{
      this.hasPermission = true
      }).catch((error)=>{
      console.log(error)
    })
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
