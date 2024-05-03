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


  async requestPermission() {
    if (isPlatformBrowser(this._platform) && 'mediaDevices' in navigator) {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        return Promise.resolve();
      } catch (err) {
        alert(err);
        return Promise.reject(err);
      }
    } else {
      return Promise.reject();
    }
  }
  handleClick(){
       document.getElementById('button')?.click()
      this.cameraButtonClicked = false;
      this.cd.detectChanges()
  }
 
  openDialog() {
    alert("opened")
         this.hasPermissions().then((result:any) =>{
             if(result.state == "granted"){
              alert("granted")
               this.hasPermission = true;
               if(this.isMobile){
                document.getElementById('button')?.click()
              }else{
                this.openDialog2()
              }
            }else if(result.state == 'prompt'){
              alert("prompt")

              // this.requestPermission()
              // .then(() => {
              //   if(this.isMobile){
              //     alert('mobile')
              //     this.hasPermissions().then((result:any)=>{
              //       if(result.state == "granted"){
              //           alert("granted")
              //         document.getElementById('button')?.click()
              //       }else{
              //           alert('not granted')
              //       }
              //     })
              //   }else{
              //     this.openDialog2()
              //   }
              //  })
              // .catch((error) => {
              //   this.hasPermission = false;
              //   console.log(error);
              // })
            }else{
              this.hasPermission = false;
            }
        }).catch((err)=>{

        })
    
  }

  async hasPermissions()  {
      try{
         let result  = await navigator.permissions.query({ name: "geolocation" })
        return Promise.resolve(result)
      }catch(err){
         return Promise.resolve(err)
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
