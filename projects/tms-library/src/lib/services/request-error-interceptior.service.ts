import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { UxAppShellService } from '@eui/core';
import { catchError } from 'rxjs/operators';

import { ErrorLogService } from './error-log.service';

@Injectable()
export class RequestErrorInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) { }

  /**
   * @param req
   * @param next
   * @returns
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // retry(1), Otherwise double error message. Check how to solve
      catchError((error: HttpErrorResponse) => {
        const uxAppShellService = this.injector.get(UxAppShellService);
        const errorLogService = this.injector.get(ErrorLogService);

        let errMsg = (error.message) ? error.message : error.status ? error.status + ' - ' + error.statusText : 'Server error';

        let message = {
          errorMessage: errMsg,
          stack: (new Error()).stack
        };

        let displayError = { ...error, message: 'Server error. Please consult your helpdesk.' };

        if (error.status) {
          if (error.status === 417) {
            displayError = {
              ...error,
              message: 'The link you have copied is not correct, please check that it has been copied correctly. ' +
                'If the link still does not work please check with your contact person.'
            };
          } else if (error.status !== 200) {
            if (error.url?.endsWith('/tms-ui-log') === false) {
              errorLogService.logErrorToServer(message, true);
            }
          }
        }
        return throwError(displayError);
      })
    );
  }
}
