import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pin-dialog',
  templateUrl: './pin-dialog.component.html',
  styleUrls: ['./pin-dialog.component.scss']
})
export class PinDialogComponent {

  constructor(public dialogRef : MatDialogRef<PinDialogComponent>,  @Inject(MAT_DIALOG_DATA) public dialogData: any){
    console.log(dialogData)
  }

}
