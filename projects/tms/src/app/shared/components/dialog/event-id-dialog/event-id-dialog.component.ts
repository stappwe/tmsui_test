import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

import { GeneralRoutines } from 'tms-library';

@Component({
  selector: 'app-event-id-dialog',
  templateUrl: './event-id-dialog.component.html',
  styleUrls: ['./event-id-dialog.component.scss']
})
export class EventIdDialogComponent implements OnInit {
  @Input() title: string;
  @Input() caption: string;
  @Input() placeholder: string;

  public eventId: FormControl;

  constructor(public dialogRef: MatDialogRef<EventIdDialogComponent>) {
    this.title = 'Title';
    this.caption = 'Caption';
  }

  ngOnInit() {
    this.eventId = new FormControl(null, { validators: Validators.compose([Validators.required, GeneralRoutines.limitToDecimal(5)]) });
  }

  public onOk() {
    this.dialogRef.close(this.eventId.value);
  }

  public onCancel() {
    this.dialogRef.close(undefined);
  }
}
