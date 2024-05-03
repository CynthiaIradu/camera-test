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
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'cameraTest';
  notificationService: any;
  @ViewChild('camera') cameraInput!: HTMLInputElement;
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
        let stream = await navigator.mediaDevices.getUserMedia({
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
    let input= document.getElementById('input')
    this.requestPermission().then(() =>{
      input?.click()
    }).catch((error)=>{
      console.log(error)
    })
  }

  isCaptureAttributeSupported() {
    var input = document.createElement('input');
    return 'capture' in input;
  }

  openDialog2(stream: MediaStream) {
    let dialogRef = this.dialog.open(CameraDialogComponent, {
      data: { stream: stream },
    });
    dialogRef.afterClosed().subscribe((photo) => {
      if (photo) {
        console.log(photo);
      }
    });
  }
}
