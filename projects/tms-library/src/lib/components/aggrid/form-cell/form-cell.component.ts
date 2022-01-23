import { Component, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';

import { AgEditorComponent } from 'ag-grid-angular';

@Component({
  selector: 'app-form-cell',
  template: `
    <input #input [(ngModel)]="value" style="padding: 1px; height: 23px; width: 100%">
    `
})
export class FormCellComponent implements AgEditorComponent, AfterViewInit {
  public value: number;
  private params: any;

  @ViewChild('input', { read: ViewContainerRef })
  public input: ViewContainerRef;

  ngAfterViewInit() {
    // focus on the input
    setTimeout(() => this.input.element.nativeElement.focus());
  }

  agInit(params: any) {
    this.params = params;
    this.value = this.params.value;
  }

  /* Component Editor Lifecycle methods */
  // the final value to send to the grid, on completion of editing
  getValue() {
    // this simple editor doubles any value entered into the input
    return this.value;
  }

  // Gets called once before editing starts, to give editor a chance to
  // cancel the editing before it even starts.
  isCancelBeforeStart() {
    return false;
  }

  // Gets called once when editing is finished (eg if Enter is pressed).
  // If you return true, then the result of the edit will be ignored.
  isCancelAfterEnd() {
    return false;
  }
}
