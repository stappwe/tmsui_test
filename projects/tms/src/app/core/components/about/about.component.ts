import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG_TOKEN, UxAppShellService } from '@eui/core';

import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-core-about',
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
  modulesVersions: string;
  appInfos: string;

  @Output() modalClosed: EventEmitter<any> = new EventEmitter<any>();

  constructor(
        public translate: TranslateService,
        private uxAppShellService: UxAppShellService,
        public coreService: CoreService,
        @Inject(CONFIG_TOKEN) private config,
    ) {}

  ngOnInit() {
    if (this.config.versions) {
      this.modulesVersions = Object.keys(this.config.versions).reduce((acc, _module) => {
        acc = acc === '' ? `${_module}: ${this.config.versions[_module]}` : `${acc}\n${_module}: ${this.config.versions[_module]}`;
        return acc;
      }, '');
    }

    if (this.config.appInfos) {
      this.appInfos = this.config.appInfos;
    }
  }

  onClose(event: any) {
    this.coreService.isAboutOpen = false;
  }
}
