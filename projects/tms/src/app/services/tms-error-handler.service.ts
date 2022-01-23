import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { UxAppShellService } from '@eui/core';

import { ErrorLogService } from 'tms-library';

@Injectable()
export class TMSErrorHandler extends ErrorHandler {
  constructor(private injector: Injector) {
    super();
  }

  handleError(error): void {
    const errorLogService = this.injector.get(ErrorLogService);
    const uxAppShellService = this.injector.get(UxAppShellService);

    // forward to the normal error handling
    super.handleError(error);
    // Server side logging of the errors
    errorLogService.logAngularToServer(error, true);
  }
}
