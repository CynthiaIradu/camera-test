import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CameraDialogComponent } from './camera-dialog/camera-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports:      [ BrowserModule, MatSelectModule, MatFormFieldModule, MatDialogModule, MatIconModule, FormsModule, MatButtonModule,CommonModule, BrowserAnimationsModule  ],
  declarations: [ AppComponent, CameraDialogComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }