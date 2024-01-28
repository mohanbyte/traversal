import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinDialogComponent } from './dialog/pin-dialog/pin-dialog.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [PinDialogComponent],
  imports: [CommonModule, MaterialModule],
})
export class GeneralModule {}
