import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CameraDialogComponent } from './camera-dialog/camera-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cameraTest';
  constructor( public dialog: MatDialog){

  }

  openDialog(){
    console.log("clicked")
    let dialogRef = this.dialog.open(CameraDialogComponent, {});

    dialogRef.afterClosed().subscribe((photo) => {
      if (photo) {
        console.log(photo)
      }
    });
  }

}
