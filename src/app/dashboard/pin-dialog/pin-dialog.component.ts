import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  Inject,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Validators, Editor, Toolbar } from 'ngx-editor';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pin-dialog',
  templateUrl: './pin-dialog.component.html',
  styleUrls: ['./pin-dialog.component.scss'],
})
export class PinDialogComponent implements OnInit, OnDestroy {
  editorDoc = {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: {
          level: 1,
          align: null,
        },
        content: [
          {
            type: 'text',
            text: 'Write something about your adventures....',
          },
        ],
      },
    ],
  };
  editor: Editor = new Editor();

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  constructor(
    public dialogRef: MatDialogRef<PinDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.editor = new Editor();
  }
  ngOnInit(): void {
    if (this.dialogData.data.note) {
      this.form.get('editorContent').patchValue(this.dialogData.data.note);
      console.log(this.dialogData.data.note);
    } else {
      this.editor = new Editor();
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  form = new FormGroup({
    editorContent: new FormControl(
      { value: this.editorDoc, disabled: false },
      Validators.required()
    ),
  });

  // * Save Pin Info

  delete() {
    this.dialogRef.close({ delete: true });
  }
  savePinInfo() {
    this.dialogRef.close({ info: this.form.get('editorContent').value });
  }
}
