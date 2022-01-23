import { Component } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { IHeaderParams } from 'ag-grid-community';

export type selectAllFunction = (value: boolean, params: any) => void;

interface AgHeaderCheckboxParams extends IHeaderParams {
  selectAll: selectAllFunction;
}

@Component({
  template: `
    <mat-checkbox [ngModel]="value" (ngModelChange)="onChange($event)"></mat-checkbox>{{ params?.displayName }}
    `,
  styleUrls: ['./agheadercheckboxeditor.component.scss']
})
export class AgHeaderCheckboxEditor implements IHeaderAngularComp {
  public value: boolean;
  public params: AgHeaderCheckboxParams;

  agInit(params: any): void {
    this.params = params;
  }

  onChange(value: boolean) {
    this.value = value;
    this.params.selectAll(value, this.params);
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }
}
