import { Component, Input, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.css']
})
export class CommentDialog implements OnInit, OnChanges {
  @Input() caption: string;
  @Input() size: number;
  @Input() labelText: string;
  @Input() captionOkBtn: string;
  @Input() captionCancelBtn: string;
  @Input() required: boolean;
  @Input() additionalMessage: string;
  @Input() warningMessage: string;

  public commentDialog: FormGroup;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<CommentDialog>) {
    this.caption = 'Comment';
    this.size = 200;
    this.labelText = 'Comment';
    this.required = false;
    this.captionOkBtn = 'Ok';
    this.captionCancelBtn = 'Cancel';
    this.additionalMessage = '';
    this.warningMessage = '';
  }

  ngOnInit() {
    this.commentDialog = this.formBuilder.group({
      comment : ['', Validators.maxLength(this.size)]
    });
    this.updateValidation();
  }

  ngOnChanges(changes: SimpleChanges): any {
    if ('size' in changes || 'required' in changes) {
      this.updateValidation();
    }
  }

  public onOk() {
    this.dialogRef.close(this.commentDialog.value.comment);
  }

  public onCancel() {
    this.dialogRef.close(undefined);
  }

  private updateValidation(): void {
    if (this.required) {
      this.commentDialog.controls['comment'].setValidators(Validators.compose(([Validators.required, Validators.maxLength(this.size)])));
    } else {
      this.commentDialog.controls['comment'].setValidators(Validators.maxLength(this.size));
    }
    this.commentDialog.controls['comment'].updateValueAndValidity();
  }
}
