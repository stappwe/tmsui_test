import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  selector: 'checkbox-cell',
  template: `
    <mat-checkbox [ngModel]="value" (ngModelChange)="onChange($event)" [color]="'primary'" class="mat-checkbox"></mat-checkbox>
  `,
  styles: [':host ::ng-deep label { padding: 2px 0 0 0; }']
})
export class AgCheckboxEditor implements AgRendererComponent {
  public value: boolean;

  private params: any;

  constructor() {
  }

  agInit(params: any): void {
    this.params = params;
    this.value = params.value;
  }

  // demonstrates how you can do "inline" editing of a cell
  onChange(value: boolean) {
    this.params.node.setDataValue(this.params.colDef, value);
  }

  refresh(params: any): boolean {
    this.value = params.value;

    return true;
  }
}
