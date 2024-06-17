import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinDialogComponent } from './pin-dialog/pin-dialog.component';
import { MaterialModule } from '../material.module';
import { NgxEditorComponent, NgxEditorModule } from 'ngx-editor';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PinDialogComponent],
  imports: [CommonModule, MaterialModule, NgxEditorModule, ReactiveFormsModule],
})
export class DashboardModule {}
