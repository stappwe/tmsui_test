import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { UxAppShellService } from '@eui/core';

import { BaseService } from './base.service';
import { enAlert } from '../components/class/baseClasses';

@Injectable()
export class ErrorLogService extends BaseService {
  private name: String = 'ErrorLogService';

  constructor(http: HttpClient, uxAppShellService: UxAppShellService, injector: Injector) {
    super(http, uxAppShellService, injector);
  }

  public logAngularToServer(error: any, showErrMsg: boolean = false): string {
    const date = new Date().toISOString();
    let errMsg: string = '';
    let displayErrMsg: string = '';
    if (error instanceof HttpErrorResponse) {
      errMsg = (error.message) ? error.message : error.status ? error.status + ' - ' + error.statusText : 'Server error';
      displayErrMsg = 'There was a HTTP error. Please consult your helpdesk.';
      let message = {
        errorMessage : errMsg,
        stack: (new Error()).stack
      };
      console.error(date, 'There was a HTTP error.', error.message, 'Status code:', (<HttpErrorResponse>error).status);
      this.logErrorToServer(message);
    } else if (error instanceof TypeError) {
      // log error.name, error.message and error.stack
      errMsg = 'There was a Type error. ' + (<TypeError>error).message;
      displayErrMsg = 'There was a Type error. Please consult your helpdesk.';
      let message = {
        errorMessage : errMsg,
        stack: (new Error()).stack
      };
      console.error(date, 'There was a Type error.', (<TypeError>error).message);
      this.logErrorToServer(message);
    } else if (error instanceof Error) {
      // log error.name, error.message and error.stack
      errMsg = 'There was a general error. ' + (<Error>error).message;
      displayErrMsg = 'There was a general error. Please consult your helpdesk.';
      let message = {
        errorMessage : errMsg,
        stack: (new Error()).stack
      };
      console.error(date, 'There was a general error.', (<Error>error).message);
      this.logErrorToServer(message);
    } else {
      // log name = Other, messae = error
      errMsg = 'Something happened! ' + error;
      displayErrMsg = errMsg;
      let message = {
        errorMessage : errMsg,
        stack: (new Error()).stack
      };
      console.error(date, 'Something happened!', error);
      this.logErrorToServer(message);
    }
    // if showErrMsg then display to the UI
    if (showErrMsg === true) {
      this.uxAppShellService.growl({ severity: enAlert[enAlert.danger], summary: '', detail: displayErrMsg }, true , true);
    }

    return errMsg;
  }
}
