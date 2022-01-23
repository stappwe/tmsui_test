import { ElementRef, Inject, Injectable, Injector } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

import { of, Observable } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { EUI_CONFIG_TOKEN, EuiConfig, UxAppShellService, handleError } from '@eui/core';

import {
  BaseService,
  ChapterList,
  Country,
  enAlert,
  FormalAddress,
  ApplicationMessage,
  IMultiSelectOption,
  Language,
  LoadingService,
  MultiSelectOption,
  RequestResult,
  GeneralRoutines
} from 'tms-library';
import { Application, QlikReports } from '../shared/components/models/application.model';
import { BackupUser, enApplicationType } from '../shared/components/models/userProfile.model';
import { ViewUploadFile } from '../shared/components/models/viewUploadFile.model';
import { TMSUserService } from './user.service';
import { environment } from '../../environments/environment';
import { Property } from '../features/+tms/+administration/+administrator/shared/administrator.model';

declare var $: any;
declare var toastr: any;

export enum enPKType {
  Task = 1,
  Event = 2,
  Twinning = 3,
  Supplier = 4,
  Checklist = 5,
  Presentation = 6,
  DocumentsParticipant = 7
}

export class Email {
  public to: string;
  public cc: string;
  public bcc: string;
  public subject: string;
  public body: string;
  public filename: string = '';

  constructor(data: {
    to: string,
    cc: string,
    bcc: string,
    subject: string,
    body: string,
    filename?: string,
  } = { to: '', cc: '', bcc: '', subject: '', body: '', filename: '' }) {
    Object.assign(this, data);
  }
}

@Injectable({
  providedIn: 'root',
})
export class AppService extends BaseService {
  private _router: Router;
  private _currentRouteUrl: string;
  private _shadowDomRoot: ElementRef;
  private history = [];

  public nextRouteUrl: string;
  public application: Application;

  // Temp until implementation of the PWA standard
  public chaptersScreeningCache: ChapterList;
  public eventChaptersScreeningCache: ChapterList;

  constructor(http: HttpClient, uxAppShellService: UxAppShellService, userService: TMSUserService,
              public translate: TranslateService, private location: Location,
              injector: Injector, private loading: LoadingService) {
    super(http, uxAppShellService, injector);
    this.application = new Application(translate, userService);  // todo delete enApplicationType.TMS
  }

  public getCurrentRouteUrl(): string {
    return this._currentRouteUrl;
  }

  public getRouter(): Router {
    return this._router;
  }

  public setRouter(router: Router): AppService {
    this._router = router;
    this.init();
    return this;
  }

  public setShadowDomRoot(el: ElementRef): AppService {
    this._shadowDomRoot = el;
    return this;
  }

  public getShadowDomRoot(): ElementRef {
    return this._shadowDomRoot;
  }

  public getHTMLElement(selector: String): HTMLElement {
    return this._shadowDomRoot.nativeElement.querySelector(selector);
  }

  init(): void {
    this._router.events.subscribe((event: any): void => {
      this.navigationInterceptor(event);
    });

    this._router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        this.history = [...this.history, urlAfterRedirects];
      });
  }

  isRouteActive(route: any): boolean {
    this._currentRouteUrl = this._router.url;
    let activatedRouteUrl: string = this._router.serializeUrl(this._router.createUrlTree(route));
    return this._currentRouteUrl.indexOf(activatedRouteUrl) !== -1;
  }

  isSubRouteOf(route: any): boolean {
    this._currentRouteUrl = this._router.url;
    let activatedRouteUrl: string = this._router.serializeUrl(this._router.createUrlTree(route));
    return this._currentRouteUrl.startsWith(activatedRouteUrl);
  }

  getActiveRoute(): string {
    return this._router.url;
  }

  navigationInterceptor(event: any): void {
    if (event instanceof NavigationStart) {
      this.nextRouteUrl = event.url;
      this.loading.start();
    }
    if (event instanceof NavigationEnd) {
      // set the correct application type
      this.application.setAppType(this._router.url);
      this.loading.stop();
      this._currentRouteUrl = this._router.url;
    }
    if (event instanceof NavigationCancel) {
      this.loading.stop();
    }
    if (event instanceof NavigationError) {
      this.loading.stop();
    }
  }

  public hasAction(actionName: string): boolean {
    return this.application.appType && this.application.user.hasAction(this.application.appType, actionName);
  }

  public hasAnyAction(actionNames: Array<string>): boolean {
    return this.application.appType && this.application.user.hasAnyAction(this.application.appType, actionNames);
  }

  showToast(type: string, title: string, message: string) {
    toastr.options = {
      'closeButton': true,
      'debug': false,
      'newestOnTop': true,
      'progressBar': true,
      'positionClass': 'toast-bottom-right',
      'preventDuplicates': false,
      'onclick': null,
      'showDuration': '300',
      'hideDuration': '1000',
      'timeOut': '5000',
      'extendedTimeOut': '1000',
      'showEasing': 'swing',
      'hideEasing': 'linear',
      'showMethod': 'fadeIn',
      'hideMethod': 'fadeOut'
    };
    toastr[type](message, title);
  }

  public getHistory(): string[] {
    return this.history;
  }

  public getPreviousUrl(): string {
    return this.history[this.history.length - 2] || this._currentRouteUrl;
  }

  public getLanguages(): Observable<Array<Language> | {}> {
    return this.http.get(this.apiBaseUrl + 'alllanguages').pipe(
      map( (data: any) => {
        const languages: Array<Language> = [];
        for (const lang of data) {
          languages.push(new Language(lang));
        }
        return languages;
      }),
      catchError(error => handleError(error))
    );
  }

  /**
   * set backup user
   * @param {string} selectedUserId
   * @param {string} backupUserId - userId of the backup user
   * @returns {<RequestResult>} - result: true = success, false = failed + error message
   */
  public setBackupUser(selectedUserId: string, backupUserId: string, hasAllAccess: boolean ): Observable<RequestResult | {}> {
    let targetUrl = this.apiBaseUrl + 'my-settings/TMS/set-own-backup-user/' + backupUserId;

    if (hasAllAccess) {
      targetUrl = this.apiBaseUrl + 'my-settings/TMS/set-backup-user/' + selectedUserId + '/' + backupUserId;
    }
    return this.http.post(targetUrl, null, { headers: this._headers }).pipe(
      map((data: any) => {
        return new RequestResult(true, '', enAlert.success);
      }),
      catchError(error => handleError(error))
    );
  }

  public updateActiveUserRole(userRoleId: number): Observable<boolean> {
    if (this.application.appType === enApplicationType.TMS) {
      const targetUrl = this.apiBaseUrl + 'user/change-active-user-role/' + this.application.appTypeString + '/' + userRoleId;
      // @ts-ignore
      return this.http.get(targetUrl).pipe(
        catchError(error => handleError(error))
      );
    } else {
      return of(true);
    }
  }

  /**
   * set teamId
   * @param {number} teamId - id of selected team
   * @returns {<RequestResult>} - result: true = success, false = failed + error message
   */
  public setTeam(selectedUserId: string, teamId: number): Observable<RequestResult | {}> {
    return this.http.post(this.apiBaseUrl + 'my-settings/TMS/set-team/' + selectedUserId + '/' +
      (teamId ? teamId : ''), null, { headers: this._headers }).pipe(
      map((data: any) => {
        return new RequestResult(true, '', enAlert.success);
      }),
      catchError(error => handleError(error))
    );
  }

  public getAllUsers(forUserId: string = ''): Observable<Array<BackupUser>> {
    const targetUrl: string = this.apiBaseUrl + 'my-settings/TMS/all-users-list';
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        return data.map((item: any) => Object.assign(new BackupUser(), item));
      }),
      catchError(error => handleError(error))
    );
  }

  public getTeamList(): Observable<Array<IMultiSelectOption>> {
    const targetUrl: string = this.apiBaseUrl + 'my-settings/TMS/team-list';
    return this.http.get<Array<IMultiSelectOption>>(targetUrl).pipe(
      map((data: any) => {
        return data.map((item: any) => Object.assign(new MultiSelectOption(), item));
      }),
      catchError(error => handleError(error))
    );
  }

  /**
   * Get the list of user for which a backup user specified or if the forUserId is specified the possible backup users
   * @param {string} [forUserId=''] - If provided, list will contains possible backup users
   * @returns {<Array<User>>} - List of users
   */
  public getBackupUser(forUserId: string = ''): Observable<Array<BackupUser>> {
    forUserId = (forUserId) ? forUserId : '';

    const targetUrl: string = this.apiBaseUrl + 'my-settings/TMS/backup-user-list/' + forUserId;
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        return data.map((item: any) => Object.assign(new BackupUser(), item));
      }),
      catchError(error => handleError(error))
    );
  }

  public getDocumentUploadUrl(id: number, pkType: enPKType, templateId?: number): string {
    return this.apiBaseUrl + this.application.appTypeString + '/upload-document/' + id + '/' + pkType + '/' +
      '?templateId=' + (templateId ? templateId : null);
  }

  public getDocumentDownloadURL(id: number, pkType: enPKType): string {
    return this.apiBaseUrl + this.application.appTypeString + '/download-document/' + id + '/' + pkType;
  }

  /**
   * Get documents for specified ID and templateId
   * @param {number} id - depending on application taskId, eventId, twinning number or supplierId
   * @param {enPKType} pktype - document type: Task, Event, Twinning
   * @param {number} [templateid=undefined] - templates to be loaded, if undefined, load all
   * @returns {<Array<ViewUploadFileItem>>}
   */
  public getDocuments(id: number, pkType: enPKType, templateId?: number): Observable<Array<ViewUploadFile> | {}> {
    const targetUrl = this.apiBaseUrl + this.application.appTypeString + '/get-documents/' + id + '/' +
      pkType + '/' + '?templateId=' + (templateId ? templateId : null);
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        let viewUploadFiles: Array<ViewUploadFile> = [];

        for (let item of data) {
          // convert dates
          viewUploadFiles.push(new ViewUploadFile(item.id, item.templateId, item.name, item.url, item.size,
            item.lastModified, item.lastModifiedBy, item.permission));
        }

        // todo temp for demo
        if (templateId) {
          viewUploadFiles = _.filter(viewUploadFiles, ['file.templateId', templateId]);
        }

        return viewUploadFiles;
      }),
      catchError(error => handleError(error))
    );
  }

  public extractViewUploadData(id: number, pkType: enPKType, templateId?: number): string {
    return this.apiBaseUrl + this.application.appTypeString + '/viewUploadList-print/' + id + '/' + pkType +
      '/' + '?templateId=' + (templateId ? templateId : null);
  }

  public getTemplates(templateId?: number): Observable<Array<IMultiSelectOption>> {
    const targetUrl = this.apiBaseUrl + this.application.appTypeString + '/get-templates/' + (templateId ? templateId : null);
    // @ts-ignore
    return this.http.get(targetUrl).pipe(
      catchError(error => handleError(error))
    );
  }

  public getAllowedFileTypes(pkType: enPKType): Observable<Array<string> | {}> {
    const targetUrl = this.apiBaseUrl + this.application.appTypeString + '/get-allowed-fileTypes/' + pkType;
    return this.http.get<Array<string>>(targetUrl).pipe(
      catchError(error => handleError(error))
    );
  }

  public deleteDocument(id: number, pkType: enPKType, taskId: number, templateId: number): Observable<boolean | {}> {
    const targetUrl = this.apiBaseUrl + this.application.appTypeString + '/delete-document/' +
      taskId + '/' + templateId + '/' + id + '/' + pkType;
    return this.http.get<boolean>(targetUrl).pipe(
      catchError(error => handleError(error))
    );
  }

  public getQlikViewUrl(): Observable<string | {}> {
    return this.http.get(this.apiBaseUrl + 'TMS/qlikView-url', { responseType: 'text' }).pipe(
      catchError(error => handleError(error))
    );
  }

  public getQlikReportsUrl(): Observable<QlikReports> {
    return this.http.get<QlikReports>(this.apiBaseUrl + 'TMS/qlik-reports-url').pipe(
      catchError(error => handleError(error))
    );
  }

  /**
   * Get the screening chapter structure
   * @param [topLevelOnly=false] - true = only top level chapter will be extracted (default = false)
   * @returns {Observable<R>} - list of elements returned
   */
  public getChaptersScreening(topLevelOnly: boolean = false): Observable<ChapterList | {}> {
    if (this.chaptersScreeningCache === undefined) {
      return this.http.get(this.apiBaseUrl + this.application.appTypeString + '/chapters').pipe(
        map((data1: any) => {
          const data = _.filter(data1, function (item) {
            return (topLevelOnly === false || item.parentid === 0);
          }.bind(this));
          const chapterList: ChapterList = new ChapterList();
          chapterList.loadJSON(data);
          // Cache the result
          this.chaptersScreeningCache = chapterList;

          return chapterList;
        }),
        catchError(error => handleError(error))
      );
    } else {
      return of(this.chaptersScreeningCache);
    }
  }

  /**
   * Get the screening chapter structure for the event detail page
   * @param [topLevelOnly=false] - true = only top level chapter will be extracted (default = false)
   * @returns {Observable<R>} - list of elements returned
   */
  public getEventChaptersScreening(topLevelOnly: boolean = false): Observable<ChapterList | {}> {
    if (this.eventChaptersScreeningCache === undefined) {
      return this.http.get(this.apiBaseUrl + this.application.appTypeString + '/event-chapters').pipe(
        map((data1: any) => {
          const data = _.filter(data1, function (item) {
            return (topLevelOnly === false || item.parentid === 0);
          }.bind(this));
          const chapterList: ChapterList = new ChapterList();
          chapterList.loadJSON(data);
          // Cache the result
          this.eventChaptersScreeningCache = chapterList;

          return chapterList;
        }),
        catchError(error => handleError(error))
      );
    } else {
      return of(this.eventChaptersScreeningCache);
    }
  }

  public getCountryList(beneficiarytypes: number[] = []): Observable<any> {
    return this.http.get(this.apiBaseUrl + this.application.appTypeString + '/keycontactcountries?groups='
      + beneficiarytypes).pipe(
      map((data: any) => {
        const countries: Array<any> = [];

        for (const item of data) {
          countries.push(new Country(item.id, item.countryName));
        }
        return countries;
      }),
      catchError(error => handleError(error))
    );
  }

  public getSupplierTypes(): Observable<any> {
    return this.http.get(this.apiBaseUrl + this.application.appTypeString + '/allsuppliertypes').pipe(
      catchError((error: any) => handleError(error))
    );
  }

  public eventDetailsUrl(eventId: number, hasBackBtn: boolean = true): string {
    return '#/tms/events/detail/' + eventId + '?hasBackBtn=' + (hasBackBtn === true) ? 'true' : 'false';
    // return GeneralRoutines.getAbsolutePath(environment.oldTMSUrl) + 'detailEvent.do?eventID=' + eventId
    //  + '&userRoleId=' + this.application.user.activeUserRole.userRoleId;
  }

  public openEventDetails(eventId: number): void {
    window.open('#/tms/events/detail/' + eventId + '?hasBackBtn=false');
    // window.open(GeneralRoutines.getAbsolutePath(environment.oldTMSUrl) + 'detailEvent.do?eventID=' + eventId +
    //  '&userRoleId=' + this.application.user.activeUserRole.userRoleId, target);
  }

  public openTask(taskId: number): void {
    window.open('#/tms/tasks/detail/' + taskId + '?hasBackBtn=false');
  }

  public getFormalAddress(): Observable<Array<FormalAddress> | {}> {
    return this.http.get(this.apiBaseUrl + this.application.appTypeString + '/formal-addresses').pipe(
      map((data: any) => {
        const formalAddressList: Array<FormalAddress> = [];

        for (const item of data) {
          formalAddressList.push(new FormalAddress(item.id, item.name));
        }
        return formalAddressList;
      }),
      catchError((error: any) => handleError(error))
    );
  }

  public getJobTitleList(): Observable<Array<MultiSelectOption> | {}> {
    const targetUrl = this.apiBaseUrl + this.application.appTypeString + '/job-title-list';
    return this.http.get<Array<IMultiSelectOption>>(targetUrl).pipe(
      map((data: any) => {
        return data.map((item: any) => Object.assign(new MultiSelectOption(), item));
      }),
      catchError(error => handleError(error))
    );
  }

  public updateLastRouteState(routerState: string): void {
    if (this.history[this.history.length - 1]) {
      this.history[this.history.length - 1] = routerState;
      this.location.replaceState(routerState);
    }
  }

  public getGridFilters(gridName: string, id: number = null): any {
    const targetUrl = this.apiBaseUrl + this.application.appTypeString + '/get-grid-filters/' + gridName + ( id ? '/' + id : '' );
    return this.http.get(targetUrl).pipe(
      catchError(error => handleError(error))
    );
  }

  public getApplicationList(registerId?: number): Observable<Array<IMultiSelectOption> | {}> {
    const targetUrl = this.apiBaseUrl + (registerId ? 'register' : this.application.appTypeString + '/admin') + '/application-list';
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const applicationList: Array<IMultiSelectOption> = [];
        for (const item of data) {
          applicationList.push(new MultiSelectOption(item.id, item.name));
        }
        return applicationList;
      }),
      catchError((error: any) => handleError(error))
    );
  }

  public logoutFromTms(): Observable<any> {
    return this.http.get(this.apiBaseUrl + 'logout-from-tms', { responseType: 'text' }).pipe(
      catchError(error => handleError(error))
    );
  }

  public getApplicationMessage(): Observable<ApplicationMessage> {
    return this.http.get(this.apiBaseUrl + 'application-message').pipe(
      map((data: any) => {
        return new ApplicationMessage(data);
      }),
      catchError(error => handleError(error))
    );
  }

  public getGeneralCountryList(): Observable<Array<Country> | {}> {
    return this.http.get(this.apiBaseUrl + 'generalCountryList').pipe(
      map((data: any) => {
        const countries: Array<Country> = [];

        for (const item of data) {
          countries.push(new Country(item.id, item.countryName, item.abbreviation));
        }
        return countries;
      }),
      catchError(error => handleError(error))
    );
  }

  public openWebFolder(eventId: number, lpath?: string) {
    lpath = (lpath) ? lpath : '/IBU';
    GeneralRoutines.openURL(environment.webfolderUrl + 'accessFolder/' + eventId + lpath, '_webfolder');
  }

  public getFolderStatusToolTip(erSigned: boolean): string {
    let tooltip = '';
    if (erSigned === true) {
      // tslint:disable-next-line:max-line-length
      tooltip = 'Please note that for ER signed events the web folder is readonly. You can ask the IBU Administrator to unlock the web folder for this event. After unlocking the folder will be automatically locked again after 30 days.';
    } else {
      tooltip = 'Open Web Folder';
    }
    return tooltip;
  }

  // public createEmail(email: Email): Observable<RequestResult | {}> {
  //   return this.http.post(this.apiBaseUrl + 'my-settings/TMS/set-team/' + selectedUserId + '/' +
  //     (teamId ? teamId : ''), null, { headers: this._headers }).pipe(
  //     map((data: any) => {
  //       return new RequestResult(true, '', enAlert.success);
  //     }),
  //     catchError(error => handleError(error))
  //   );
  // }

  public getNationalityList(): Observable<Array<{ id: number, nationality: string }>> {
    return this.http.get<Array<{ id: number, nationality: string }>>(this.apiBaseUrl + 'nationalities');
  }

  public getProperty(property: String, taiexContractorId: number = 0): Observable<Property | {}> {
    const targetUrl = this.apiBaseUrl + this.application.appTypeString + '/admin/property-detail/'
      + property + '/' + taiexContractorId;
    return this.http.get<Property>(targetUrl).pipe(
      catchError(error => handleError(error))
    );
  }
}
