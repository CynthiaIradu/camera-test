import {
  ChangeDetectionStrategy,
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
import {  ChangeDetectorRef } from '@angular/core'
import { MatButton } from '@angular/material/button';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatDialogModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'cameraTest';
  notificationService: any;
  @ViewChild('camera') cameraInput!: HTMLInputElement;
  @ViewChild('cameraButton') cameraButton!: MatButton;

  hasPermission: boolean = false;
  isMobile: boolean = false;
  stream!: MediaStream;
  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private _platform: Object
  ) {}

  ngOnInit(): void {
    this.isCaptureAttributeSupported()
     
  }
 
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
    if(!this.stream){
      this.requestPermission().then(() =>{
        this.hasPermission = true
        if(this.hasPermission && this.isMobile){
          this.cameraButton._elementRef.nativeElement.addEventListener('click', () => {
               this.cameraInput.click()
          })
          document.getElementById('button')?.click()
          this.cd.detectChanges()
        }else{
          this.openDialog2()
        }
        this.cd.detectChanges()
        }).catch((error)=>{
           console.log(error)
       })
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
