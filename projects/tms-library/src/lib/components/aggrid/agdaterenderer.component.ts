import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  template: '{{ value | date: "dd/MM/yyyy" }}'
})
export class AgDateRendererComponent implements AgRendererComponent {
  public value;

  agInit(params: any) {
    this.value = params.value;
  }

  refresh(params: any): boolean {
    this.value = params.value;

    return true;
  }
}
