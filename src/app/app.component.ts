import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CameraDialogComponent } from './camera-dialog/camera-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
 import { isPlatformBrowser } from '@angular/common';
  @Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cameraTest';
  notificationService: any;
  @ViewChild('camera') cameraInput!: HTMLInputElement
  constructor( public dialog: MatDialog, @Inject(PLATFORM_ID) private _platform: Object,
){}
 
onFileSelected(event: Event){
console.log(event)
}
  async openDialog(){
    if (isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
      try {
        let stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if(this.isCaptureAttributeSupported()){
           document.getElementById('input')?.click()
        }else{
          this.openDialog2(stream)
        }
        
       } catch (err) {
        alert(err);
      }
    } else {
      alert('Current browser is not supported');
    }
  }

  isCaptureAttributeSupported() {
    var input = document.createElement('input');
    return 'capture' in input;
   }

   openDialog2(stream:MediaStream){
    let dialogRef = this.dialog.open(CameraDialogComponent, {data:{stream:stream}});
        dialogRef.afterClosed().subscribe((photo) => {
         if (photo) {
          console.log(photo)
         }
         });
   }

}
