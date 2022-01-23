import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { GeneralRoutines } from '../../generalRoutines';

@Component({
  selector: 'url-cell-renderer',
  template: `
    <div>
      <span [hidden]="!params?.readonly">{{ params.value }}</span>
      <a (click)="onClick($event)" [hidden]="params?.readonly">{{ params.value }}</a>
    </div>`
})
export class UrlCellRendererComponent implements ICellRendererAngularComp {
  private urlLink: string = undefined;
  public params = { value: undefined, data: undefined, readonly: false, url: undefined, idParams: undefined };

  constructor() {
  }

  /**
   * setup
   * @param params - should contain url: this.openPersonPageUrl, idParams: string[], readonly: false
   */
  public agInit(params): void {
    this.params = params;
    if (!params.url) {
      throw new Error('URL parameter for UrlCellRendererComponent missing!');
    }
    this.setUrlLink();
  }

  // called when the cell is refreshed
  public refresh(params: any): boolean {
    this.params = params;
    this.setUrlLink();

    return true;
  }

  public onClick($event): void {
    $event.preventDefault();
    $event.stopPropagation();
    if (this.urlLink) {
      window.open(this.urlLink, '_blank');
    }
  }

  private setUrlLink(): void {
    this.urlLink = this.params.url;
    for (let param of this.params.idParams) {
      let paramValue = this.params.data[param] ? this.params.data[param] : '';
      this.urlLink = this.urlLink.replace('{' + param + '}', paramValue);
    }
    this.params.readonly = (GeneralRoutines.isNullOrUndefined(this.urlLink) || this.urlLink === '') ? true : this.params.readonly;
  }
}
