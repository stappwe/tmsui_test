import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { LoadingService } from '../../../services/loading.service';

export enum enMessageDialog {
  info = 1,
  accept = 2
}

@Component({
  selector: 'message-dialog',
  templateUrl : './messagedialog.component.html',
  styleUrls : ['./messagedialog.component.css']
})
export class MessageDialog {
  @Input() message: string;
  @Input() caption: string = 'Confirm';
  @Input() captionOkBtn: string = 'Yes';
  @Input() captionCancelBtn: string = 'No';
  @Input() messageType: enMessageDialog = enMessageDialog.accept;
  @Input() closeValueUndefined: boolean = false;

  public enMessageDialog: typeof enMessageDialog = enMessageDialog;

  constructor(public dialogRef: MatDialogRef<MessageDialog>, private loading: LoadingService) {
    // todo
    this.loading.disable();
  }

  public onOk() {
    this.dialogRef.close(true);
    this.loading.enable();
  }

  public onCancel() {
    this.dialogRef.close(false);
    this.loading.enable();
  }

  public onClose() {
    this.dialogRef.close(this.closeValueUndefined === true ? undefined : false);
    this.loading.enable();
  }
}
