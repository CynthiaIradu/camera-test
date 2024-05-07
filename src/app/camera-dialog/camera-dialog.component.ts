import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
  

interface videoInput  {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'camera-dialog',
  templateUrl: './camera-dialog.component.html',
  styleUrls: ['./camera-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
 })
export class CameraDialogComponent implements OnInit, AfterViewInit {
  @ViewChild('video', { static: true }) video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canva', { static: true }) canva!: ElementRef<HTMLCanvasElement>;
  @ViewChild('photo', { static: true }) photo!: ElementRef<HTMLImageElement>;
  @ViewChild('select') select!: MatSelect;
  width: number = 400;
  height: number = 400;
  buttonDisabled!: boolean;
  label!: string;
  stream!: MediaStream;
  selectedVideoInput!: string;
  videoInputs!: videoInput[];
  selectDisabled!: boolean;
  playPromise!:Promise<void>;


  constructor(
    private dialogRef: MatDialogRef<CameraDialogComponent>,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: {videoInputs: videoInput[]}
    
  ) {

  }

   ngOnInit() {
    this.buttonDisabled = true;
    this.selectDisabled = true;
    this.label = 'Take Photo';
    this.videoInputs = this.data.videoInputs;
  }

  async ngAfterViewInit(){
    this.updateVideoStream()
    const _video = this.video.nativeElement;
    const _canva = this.canva.nativeElement;
    _video.setAttribute('height', this.height.toString());
    _video.setAttribute('width', this.width.toString());
    _canva.setAttribute('height', this.height.toString());
    _canva.setAttribute('width', this.width.toString());
    this.selectedVideoInput = this.videoInputs[0].value


  }
  
 
  takePhoto() {
    let context = this.canva.nativeElement.getContext('2d');
      if (this.width && this.height) {
      this.canva.nativeElement.width = this.width;
      this.canva.nativeElement.height = this.height;
      context?.drawImage(this.video.nativeElement, 0, 0, this.width, this.height);

      let data = this.canva.nativeElement.toDataURL('image/png');
      if (data) {
        this.photo.nativeElement.setAttribute('src', data);
        this.buttonDisabled = false;
        this.label = 'Retake Photo';
      }
    } else {
      this.cancel();
    }
  }

  savePhoto() {
    this.canva.nativeElement.toBlob((blob) => {
       this.cancel();
      this.dialogRef.close('file');
    }, 'image/jpeg');
  }
  
  cancel() {
    this.resetCanva()
    this.stopVideo()
  }

  async stopVideo(){
    if (this.stream) {
      try {
        await this.playPromise;
        this.video.nativeElement.pause();
        this.stream.getVideoTracks().forEach((track) => track.stop());
        this.video.nativeElement.srcObject = null;
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    }else{
      return;

    }
  }

  resetCanva(){
    let context = this.canva.nativeElement.getContext('2d');
    if(context){
      context.fillStyle = '#AAA';
      context.fillRect(0, 0, this.canva.nativeElement.width, this.canva.nativeElement.height);
    }

    let data = this.canva.nativeElement.toDataURL('image/png');
    this.photo.nativeElement.setAttribute('src', data);
  }
 
  async updateVideoStream(){
    this.selectDisabled = true;
    this.cd.detectChanges()
    this.stopVideo()
    const _video = this.video.nativeElement;
    try{
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: this.selectedVideoInput
        },
        audio: false,
      });
    }catch(error){
      console.log(error)
    }
    
    _video.srcObject = this.stream;
     await _video.play();
     this.selectDisabled = false;
     this.cd.detectChanges()


  }
  
  onSelect(selectedVideoInput:string){
     this.updateVideoStream()
     console.log(selectedVideoInput)
   }

    
}
