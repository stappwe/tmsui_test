import { TranslateService } from '@ngx-translate/core';

export class Module {
  private name: string;

  constructor(name: string, private _translate: TranslateService) {
    this.name = name.toLowerCase();
  }

  get fullTitle(): string {
    return this._translate.instant(this.name + '.app-header.component.fullTitle');
  }

  get shortTitle(): string {
    return this._translate.instant(this.name + '.app-header.component.shortTitle');
  }
}
