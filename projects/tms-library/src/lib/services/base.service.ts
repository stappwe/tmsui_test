import { Inject, Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { UxAppShellService, EuiConfig, EUI_CONFIG_TOKEN } from '@eui/core';
import { TranslateService } from '@ngx-translate/core';

import { enAlert } from '../components/class/baseClasses';
import { GeneralRoutines } from '../components/generalRoutines';

export class RequestResult {
  private _message: string;   // corresponding message: success, warning, error...
  private translateService: TranslateService;

  public result: boolean;            // true on success, failure on error - no insert,...
  public messageType: enAlert;       //   success = 1, info = 2, warning = 3, danger = 4
  public messageTranslationCode: string; // translation code to use for retrieving the error message. Used if not null and replacing the value of the message
  public data: any;                  // to be used for any optional information returned from backend

  get message(): string {
    return (!this.messageTranslationCode || !this.translateService)
      ? this._message : this.translateService.instant(this.messageTranslationCode);
  }
  set message(value: string) {
    this._message = value;
  }

  constructor(result: boolean = false, message: string = '', messagetype: enAlert = enAlert.success, data: any = {}, messageTranslationCode: string = '',
              translateService: TranslateService = undefined) {
    this.result = result;
    this.message = message;
    this.messageType = messagetype;
    this.data = data;
    this.messageTranslationCode = GeneralRoutines.isNullOrUndefined(messageTranslationCode) ? '' : messageTranslationCode;
    this.translateService = translateService;
  }
}

export class RefreshData {
  rows: any;
  rowCount: number;

  constructor(rows?: any, rowCount?: number) {
    this.rows = rows;
    this.rowCount = rowCount;
  }
}

@Injectable()
export class BaseService {
  protected _headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  public apiBaseUrl: string;

  constructor(protected http: HttpClient, protected uxAppShellService: UxAppShellService, private injector: Injector) {
    const config: EuiConfig = this.injector.get(EUI_CONFIG_TOKEN);
    this.apiBaseUrl = config.environment.apiBaseUrl;
  }

  public logErrorToServer(message: any, consoleLog: boolean = false): void {
    this.http.post(this.apiBaseUrl + 'diagnostic/tms-ui-log', message, { headers: this._headers })
      .subscribe( res => {
        if (consoleLog === true) {
          console.error(message);
        }
      });
  }

  /**
   * Display alert message to the user
   * @param message - message to display
   * @param alertdisplaytype - Alert type: success = 0, info = 1, warning = 2, danger = 3
   * @param life - duration in seconds, if not available message will not be hidden
   * @param closeable - if message can be closed or not via a close button
   */
  public showAlert(message: string, alertdisplaytype: enAlert, life?: number, closeable?: boolean) {
    let isSticky = alertdisplaytype === enAlert.danger || (alertdisplaytype === enAlert.warning && life === undefined);
    this.uxAppShellService.growl({ severity: enAlert[alertdisplaytype], summary: '', detail: message }, isSticky ,
      alertdisplaytype !== enAlert.danger, life ? life * 1000 : undefined);
  }
}
