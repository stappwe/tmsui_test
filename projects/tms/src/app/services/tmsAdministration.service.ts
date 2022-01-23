import { Injectable, Inject, forwardRef, Injector } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';

import { of, Observable } from 'rxjs';
import { catchError, take, map } from 'rxjs/operators';
import { EUI_CONFIG_TOKEN, EuiConfig, UxAppShellService, handleError } from '@eui/core';

import { IMultiSelectOption, MultiSelectOption, BaseService, RefreshData, RequestResult, DateRange, Country, GeneralRoutines } from 'tms-library';
import { ApplicationSettings, RoleUserRole, UserDetail, UserItem,
  enArchivePKType } from '../features/+tms/+administration/shared/adminitration.model';
import {
  Action, ActionItem, ActionRole, ActionRoles, EventType, EventTypeItem, PaymentTransferRateSettings, ProcedureRecipients, Project,
  Property, RoleDetail, RoleItem, StatisticsJobItem, UserCategory, ValueRange
} from '../features/+tms/+administration/+administrator/shared/administrator.model';
import { AppService } from './app.service';
import { City } from '../shared/components/models/city.model';

export class FeedbackEvent extends MultiSelectOption implements IMultiSelectOption {
  evalCorrEmail: string;

  constructor(id?: number, name?: string, evalCorrEmail?: string) {
    super(id, name);
    this.evalCorrEmail = (evalCorrEmail) ? evalCorrEmail : '';
  }
}

@Injectable()
export class TMSAdministrationService extends BaseService {
  constructor(http: HttpClient, uxAppShellService: UxAppShellService,
              @Inject(forwardRef(() => AppService)) public appService: AppService, injector: Injector) {
    super(http, uxAppShellService, injector);
  }

  /**
   *
   * @param type - 1(Participant feedback event), 2(Impact feedback event)
   * @param {string} search - Search string which is concate of eventId and eventName
   * @returns {Observable<Array<MultiSelectOption>>}
   */
  public getEventList(type: number, search?: string): Observable<Array<FeedbackEvent> | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/find-event-list/' + type + '/'
      + '?search=' + (search ? search : '');
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const partEventList: Array<FeedbackEvent> = [];
        for (const item of data) {
          partEventList.push(new FeedbackEvent(item.eventId, item.eventId + ' - ' + item.eventName, item.eventEvalCorrEmail));
        }
        return partEventList;
      }),
      catchError(error => handleError(error))
    );
  }

  public getPartEvaluationResendList(eventId: number, search: string = ''): Observable<Array<MultiSelectOption> | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/find-part-participant/' +
      eventId + '/' + '?search=' + search;
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const participantList: Array<MultiSelectOption> = [];

        for (const item of data) {
          let label = item.participantName + ' - ' + item.participantId;
          if (item.evaluationDone) {
            label += ' - Evaluation Done';
          }
          participantList.push(new MultiSelectOption(item.participantId, label));
        }

        return participantList;
      }),
      catchError(error => handleError(error))
    );
  }

  /**
   *
   * @param participOrEventid - ParticipantId or eventId
   * @param type - 1(Participant feedback resend), 2(Impact feedback resend)
   * @param evalCorrEmail - Evaluation correpondent email used for impactfeedback questionaire
   */
  public resendParticipantQuestion(participOrEventid: number, type: number, evalCorrEmail?: string): Observable<boolean | {}> {
    // return true
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/resend-participant/' + participOrEventid + '/'
      + type + '?evalCorrEmail=' + evalCorrEmail;
    return this.http.get<boolean>(targetUrl).pipe(
      catchError((error: any) => handleError(error))
    );
  }

  public getCities(sortFilterObject: any): Observable<RequestResult | {}> {
    return this.http.post(this.apiBaseUrl + this.appService.application.appTypeString + '/city-list-filter',
      sortFilterObject, { headers: this._headers }).pipe(
      map((requestResult: any) => {
        if (requestResult.data) {
          const cities: Array<City> = [];
          for (const item of requestResult.data.rows) {
            cities.push(new City(item.cityID, item.name, item.lat, item.lng, item.visible));
          }
          requestResult.data.rows = cities;
        }
        return requestResult;
      }),
      catchError(error => handleError(error))
    );
  }

  public setCity(city: City): Observable<City> {
    let targetUrl = this.apiBaseUrl + this.appService.application.appTypeString;
    if (city.cityID === -1) {
      targetUrl += '/city-create';
    } else {
      targetUrl += '/city-update/';
    }
    const dto = JSON.stringify(city);

    return this.http.post(targetUrl, dto, { headers: this._headers }).pipe(
      map((data: any) => {
        return Object.assign(new City(), data);
      }),
      catchError(error => handleError(error))
    );
  }

  public deleteCity(city: City): Observable<boolean | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/city-delete/' + city.cityID;
    return this.http.get<boolean>(targetUrl).pipe(
      map((data: any) => {
        // response based on res returned from the server
        return true;
      }),
      catchError(error => handleError(error))
    );
  }

  public getUserList(sortFilterObject: any): Observable<RequestResult | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/user-list';
    const dto = JSON.stringify(sortFilterObject);
    return this.http.post(targetUrl, dto, { headers: this._headers }).pipe(
      map((requestResult: RequestResult) => {
        if (requestResult.data) {
          const userList: Array<UserItem> = [];
          for (const item of requestResult.data.rows) {
            userList.push(Object.assign(new UserItem(), item));
          }
          requestResult.data.rows = userList;
        }
        return requestResult;
      }),
      catchError(error => handleError(error))
    );
  }

  public searchUser(emailId: string): Observable<RequestResult> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/user-search/';
    const dto = JSON.stringify(emailId);
    return this.http.post(targetUrl, dto, { headers: this._headers }).pipe(
      map((resultData: any) => {
        if (resultData.data) {
          // tslint:disable-next-line:max-line-length
          resultData.data = new UserDetail(resultData.data.userId, resultData.data.firstName, resultData.data.familyName, resultData.data.email, resultData.data.phone, resultData.data.active);
        }
        return resultData;
      }),
      catchError((error: any) => handleError(error))
    );
  }

  public getUserDetail(userId: string): Observable<UserDetail> {
    if (GeneralRoutines.hasValue(userId)) {
      const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/user-detail/' + userId;
      return this.http.get<UserDetail>(targetUrl).pipe(
        map((data: any) => {
          if (data) {
            // translate roles to correct object
            if (data.tms) {
              const rolesUserRoles: Array<RoleUserRole> = [];
              for (const item of data.tms.roles) {
                rolesUserRoles.push(Object.assign(new RoleUserRole(), item));
              }
              data.tms.roles = rolesUserRoles;
              data.tms = Object.assign(new ApplicationSettings(), data.tms);
            }
            if (data.twinning) {
              const rolesUserRoles: Array<RoleUserRole> = [];
              for (const item of data.twinning.roles) {
                rolesUserRoles.push(Object.assign(new RoleUserRole(), item));
              }
              data.twinning.roles = rolesUserRoles;
              data.twinning = Object.assign(new ApplicationSettings(), data.twinning);
            }
          }
          return data;
        }),
        catchError(error => handleError(error))
      );
    } else {
      return of(new UserDetail());
    }
  }

  public setUserDetail(userDetail: UserDetail): Observable<RequestResult | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/userDetails-set';
    const dto = JSON.stringify(userDetail);
    return this.http.post(targetUrl, dto, { headers: this._headers }).pipe(
      map((resultData: RequestResult) => {
        if (resultData.data) {
          resultData.data = { ...new UserDetail(), ...resultData.data };
          if (resultData.data.tms) {
            const rolesUserRoles: Array<RoleUserRole> = [];
            for (const item of resultData.data.tms.roles) {
              rolesUserRoles.push(Object.assign(new RoleUserRole(), item));
            }
            resultData.data.tms.roles = rolesUserRoles;
            resultData.data.tms = { ...new ApplicationSettings(), ...resultData.data.tms };
            //   public userCategory: number;
            //   public roles: Array<RoleUserRole> = [];
            //   public defaultRole: number;
            //   public activeRole: number;
            //   public visibleAsUserList: Array<number> = [];
          }
          if (resultData.data.twinning) {
            const rolesUserRoles: Array<RoleUserRole> = [];
            for (const item of resultData.data.twinning.roles) {
              rolesUserRoles.push(Object.assign(new RoleUserRole(), item));
            }
            resultData.data.twinning.roles = rolesUserRoles;
            resultData.data.twinning = { ...new ApplicationSettings(), ...resultData.data.twinning };
          }
        }
        // resultData.data = Object.assign(new UserDetail(), JSON.parse(resultData.data));
        return resultData;
      }),
      catchError(error => handleError(error))
    );
  }

  public deleteUser(userId: number, userCategoryId: number): Observable<boolean | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/user-delete/' + userId + '/' + userCategoryId;
    return this.http.get<boolean>(targetUrl).pipe(
      catchError((error: any) => handleError(error))
    );
  }

  public getUserCategoryRoleList(userCategoryId: string, userid: string): Observable<Array<any>> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/user-category-role-list/'
      + userid + '/' + userCategoryId;
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const rolesUserRoles: Array<RoleUserRole> = [];
        for (const item of data.roles) {
          rolesUserRoles.push(Object.assign(new RoleUserRole(), item));
        }
        data.roles = rolesUserRoles;
        return data;
      }),
      catchError(error => handleError(error))
    );
  }

  extractUserListData(sortFilterObject: any): HttpRequest<any> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/user-list-print';
    const dto = JSON.stringify(sortFilterObject);

    let request: HttpRequest<any> = new HttpRequest<any>('GET', targetUrl);
    if (sortFilterObject !== undefined) {
      request = new HttpRequest<any>('GET', targetUrl, {
        params: new HttpParams().set('filters', JSON.stringify(sortFilterObject))
      });
    }
    return request;
  }

  public getRoles(): Observable<{ rows: Array<RoleItem>, rowCount: number } | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/role-list';
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const roles: Array<RoleItem> = [];
        for (const item of data) {
          roles.push(Object.assign(new RoleItem(), item));
        }
        return { rows: roles, rowCount: roles.length };
      }),
      catchError(error => handleError(error))
    );
  }

  public deleteRole(roleId: number): Observable<boolean | {}> {
    if (roleId !== -1) {
      const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/role-delete/' + roleId;
      return this.http.get<boolean>(targetUrl).pipe(
        catchError((error: any) => handleError(error))
      );
    } else {
      return of(false);
    }
  }

  public getRoleDetail(roleId: number): Observable<RoleDetail | {}> {
    if (roleId !== -1) {
      const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/role-detail/' + roleId;
      return this.http.get(targetUrl).pipe(
        map((data) => {
          return Object.assign(new RoleDetail(), data);
        }),
        catchError(error => handleError(error))
      );
    } else {
      return of(new RoleDetail());
    }
  }

  public setRoleDetail(roleDetail: RoleDetail): Observable<RoleDetail> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/role-set/';
    const dto = JSON.stringify(roleDetail);

    return this.http.post(targetUrl, dto, { headers: this._headers }).pipe(
      map((data: any) => {
        return Object.assign(new RoleDetail(), data);
      }),
      catchError((error: any) => handleError(error))
    );
  }

  public updateRoleOrder(roleList: Array<RoleItem>): Observable<{ rows: Array<RoleItem>, rowCount: number } | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/update-role-order/';
    const dto = JSON.stringify(roleList);

    return this.http.post(targetUrl, dto, { headers: this._headers }).pipe(
      map((data: any) => {
        const roles: Array<RoleItem> = [];
        for (const item of data) {
          roles.push(Object.assign(new RoleItem(), item));
        }
        return { rows: roles, rowCount: roles.length };
      }),
      catchError((error: any) => handleError(error))
    );
  }

  public getUserCategoryList(application: string = ''): Observable<Array<UserCategory> | {}> {
    let targetUrl;
    if (!application) {
      targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/user-category-list';
    } else {
      targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/user-category-list/' + application;
    }

    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const userCategoryList: Array<UserCategory> = [];
        for (const item of data) {
          userCategoryList.push(Object.assign(new UserCategory(), item));
        }
        return userCategoryList;
      }),
      catchError(error => handleError(error))
    );
  }

  public extractRoleListData(): HttpRequest<any> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/role-list-print';
    return new HttpRequest<any>('GET', targetUrl);
  }

  public getActionList(): Observable<RefreshData | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/action-list';
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const actions: Array<ActionItem> = [];
        for (const item of data) {
          actions.push(Object.assign(new ActionItem(), item));
        }
        return new RefreshData(actions, actions.length);
      }),
      catchError(error => handleError(error))
    );
  }

  public deleteAction(actionId: number): Observable<boolean | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/action-list-delete/' + actionId;
    return this.http.get<boolean>(targetUrl).pipe(
      catchError((error: any) => handleError(error))
    );
  }

  public getActionDetail(actionId: number): Observable<Action | {}> {
    if (actionId !== -1) {
      const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/action-detail/' + actionId;
      return this.http.get(targetUrl).pipe(
        map((data) => {
          const actionDetail: Action = Object.assign(new Action(), data);

          return actionDetail;
        }),
        catchError(error => handleError(error))
      );
    } else {
      return of(new Action());
    }
  }

  public setActionDetail(actionDetail: Action): Observable<Action> {
    // todo implement
    // @ts-ignore
    // return this.getActionDetail(actionDetail.actionId).pipe(
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/action-set/';
    const dto = JSON.stringify(actionDetail);

    return this.http.post(targetUrl, dto, { headers: this._headers }).pipe(
      map((data: any) => {
        return Object.assign(new Action(), data);
      }),
      catchError(error => handleError(error))
    );
  }

  public extractActionListData(): HttpRequest<any> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/action-list-print';
    return new HttpRequest<any>('GET', targetUrl);
  }

  public getActionRoleList(): Observable<RefreshData | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/action-role-list';
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const userList: Array<UserItem> = [];
        for (const item of data) {
          userList.push(Object.assign(new UserItem(), item));
        }
        return { rows: userList, rowCount: userList.length };
      }),
      catchError(error => handleError(error))
    );
  }

  public getActionRoles(actionId: number): Observable<ActionRoles> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/action-role-detail/' + actionId;
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        for (let item of data.roles) {
          item = Object.assign(new ActionRole(), item);
        }

        return data;
      }),
      catchError(error => handleError(error))
    );
  }

  public setActionRoles(actionRoles: ActionRoles): Observable<ActionRoles> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/action-roles-set/';
    const dto = JSON.stringify(actionRoles);

    return this.http.post(targetUrl, dto, { headers: this._headers }).pipe(
      map((data: any) => {
        return Object.assign(new ActionRoles(), data);
      }),
      catchError(error => handleError(error))
    );
  }

  public extractActionRolesData(): HttpRequest<any> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/action-role-list-print';
    return new HttpRequest<any>('GET', targetUrl);
  }

  public getPropertyList(): Observable<RefreshData | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/property-list';
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const propertyList: Array<Property> = [];
        for (const item of data) {
          propertyList.push(Object.assign(new Property(), item));
        }
        return { rows: propertyList, rowCount: propertyList.length };
      }),
      catchError(error => handleError(error))
    );
  }

  public deleteProperty(property: String, taiexContractorId: number): Observable<boolean | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/property-list-delete/'
      + property + '/' + taiexContractorId;
    return this.http.get<boolean>(targetUrl).pipe(
      catchError((error: any) => handleError(error))
    );
  }

  public refreshProperty(): Observable<any> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/property-refresh-cache';
    return this.http.get<any>(targetUrl).pipe(
      catchError((error: any) => handleError(error))
    );
  }

  public startBackgroundJobs(): Observable<RequestResult | {}> {
    const targetUrl = this.apiBaseUrl + 'job/startScheduler';
    return this.http.get(targetUrl, { headers: this._headers, responseType: 'text' }).pipe(
      map((data: string) => {
        return new RequestResult(true, data);
      }),
      catchError(error => handleError(error))
    );
  }

  public stopBackgroundJobs(): Observable<any> {
    const targetUrl = this.apiBaseUrl + 'job/stopScheduler';
    return this.http.get(targetUrl, { headers: this._headers, responseType: 'text' }).pipe(
      map((data: string) => {
        return new RequestResult(true, data);
      }),
      catchError(error => handleError(error))
    );
  }

  public setProperty(property: Property, isNew: boolean): Observable<Property> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/property-set/' + isNew;
    const dto = JSON.stringify(property);

    return this.http.post(targetUrl, dto, { headers: this._headers }).pipe(
      map((data: any) => {
        return Object.assign(new Property(), data);
      }),
      catchError((error: any) => handleError(error))
    );
  }

  public extractProperyList(): HttpRequest<any> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/property-list-print';
    return new HttpRequest<any>('GET', targetUrl);
  }

  public getProjectList(): Observable<{ rows: Array<Project>, rowCount: number } | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/project-list';
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const projectlist: Array<Project> = [];
        for (const item of data) {
          projectlist.push(Object.assign(new Project(), item));
        }
        return { rows: projectlist, rowCount: projectlist.length };
      }),
      catchError(error => handleError(error))
    );
  }

  public getProject(projectId: number): Observable<Project | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/project-detail/' + projectId;
    return this.http.get<Project>(targetUrl).pipe(
      take(1),
      catchError(error => handleError(error))
    );
  }

  public setProject(project: Project): Observable<Project> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/project-set/';
    const dto = JSON.stringify(project);

    return this.http.post(targetUrl, dto, { headers: this._headers }).pipe(
      map((data: any) => {
        return Object.assign(new Property(), data);
      }),
      catchError(error => handleError(error))
    );
  }

  public extractProjectList(): HttpRequest<any> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/project-list-print';
    return new HttpRequest<any>('GET', targetUrl);
  }

  public getProcedureRecipientsList(): Observable<{ rows: Array<ProcedureRecipients>, rowCount: number } | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/procedurerecipients-list';
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const procedureRecipientsList: Array<ProcedureRecipients> = [];
        for (const item of data) {
          procedureRecipientsList.push(Object.assign(new ProcedureRecipients(), item));
        }
        return { rows: procedureRecipientsList, rowCount: procedureRecipientsList.length };
      }),
      catchError(error => handleError(error))
    );
  }

  public deleteProcedureRecipients(procedureRecipientsId: number): Observable<boolean | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString +
      '/admin/procedurerecipients-list-delete/' + procedureRecipientsId;
    return this.http.get<boolean>(targetUrl).pipe(
      catchError((error: any) => handleError(error))
    );
  }

  public getProcedureRecipients(procedureRecipientsId: number): Observable<ProcedureRecipients | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString +
      '/admin/procedurerecipients-detail/' + procedureRecipientsId;
    return this.http.get<ProcedureRecipients>(targetUrl).pipe(
      catchError(error => handleError(error))
    );
  }

  public setProcedureRecipients(procedureRecipients: ProcedureRecipients): Observable<ProcedureRecipients> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/procedurerecipients-set/';
    const dto = JSON.stringify(procedureRecipients);

    return this.http.post(targetUrl, dto, { headers: this._headers }).pipe(
      map((data: any) => {
        return Object.assign(new Property(), data);
      }),
      catchError(error => handleError(error))
    );
  }

  public extractProcedureRecipientsList(): HttpRequest<any> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/procedurerecipients-list-print';
    return new HttpRequest<any>('GET', targetUrl);
  }

  public getEventTypeList(): Observable<{ rows: Array<EventTypeItem>, rowCount: number } | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/eventType-list';
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const eventTypeList: Array<EventTypeItem> = [];
        for (const item of data) {
          eventTypeList.push(Object.assign(new EventTypeItem(), item));
        }
        return { rows: eventTypeList, rowCount: eventTypeList.length };
      }),
      catchError(error => handleError(error))
    );
  }

  public getEventType(eventTypeId: number): Observable<EventType | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/eventType-detail/' + eventTypeId;
    return this.http.get<EventType>(targetUrl).pipe(
      catchError(error => handleError(error))
    );
  }

  public setEventType(eventType: EventType): Observable<EventType> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/eventType-set';
    const dto = JSON.stringify(eventType);

    return this.http.post(targetUrl, dto, { headers: this._headers }).pipe(
      map((data: any) => {
        return Object.assign(new EventType(), data);
      }),
      catchError((error: any) => handleError(error))
    );
  }

  public getEventCategoryList(): Observable<Array<MultiSelectOption> | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/eventCategoryType-list';
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const eventCategoryList: Array<MultiSelectOption> = [];
        for (const item of data) {
          eventCategoryList.push(Object.assign(new MultiSelectOption(), item));
        }
        return eventCategoryList;
      }),
      catchError(error => handleError(error))
    );
  }

  public getTeamLeaderList(): Observable<Array<any> | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/teamLeaders-list';
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const teamLeaderList: Array<any> = [];
        for (const item of data) {
          teamLeaderList.push(item);
        }
        return teamLeaderList;
      }),
      catchError(error => handleError(error))
    );
  }

  public extractEventTypeData(): HttpRequest<any> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/eventType-list-print';
    return new HttpRequest<any>('GET', targetUrl);
  }

  public setSeriesOfEvents(selectedIds: Array<number>, show: boolean): Observable<boolean | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/set-series-of-event/' + show;
    // let dto = JSON.stringify(selectedIds);
    return this.http.post<boolean>(targetUrl, selectedIds).pipe(
      catchError(error => handleError(error))
    );
  }

  /**
   * get list of items which can be archived or unarchived
   * @param search - Search text (default '') on which to limit the data: search in Id or name. Name value depends on the type
   *  (eventName, institutionName + city, familyName firstName)
   * @param size - size of records to be returned, default 50
   * @param archivePKType - Task = 1, Event = 2, Person = 3, Supplier = 4, KeyContact = 5
   */
  public getArchiveList(search: string = '', size: number = 50, archivePKType: enArchivePKType): Observable<Array<IMultiSelectOption>> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/archive-list/' + archivePKType + '/'
      + '?search=' + search;
    // @ts-ignore
    return this.http.get(targetUrl).pipe(
      catchError(error => handleError(error))
    );
  }

  public switchArchiveSetting(id: number, archive: boolean, archivePKType: enArchivePKType): Observable<RequestResult | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/switch-archive-setting/' + id +
      '/' + archivePKType + '/' + archive;
    return this.http.get(targetUrl, { headers: this._headers, responseType: 'text' }).pipe(
      map((data: string) => {
        return new RequestResult(true, data);
      }),
      catchError(error => handleError(error))
    );
  }

  /**
   * Get list of countries for which no DSA Rate exist
   */
  public getDSARateCountryList(): Observable<Array<Country> | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/country-list';
    return this.http.get<Array<Country>>(targetUrl).pipe(
      catchError(error => handleError(error))
    );
  }

  public extractDsaCountryList(): HttpRequest<any> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/dsaRates-list-print';
    return new HttpRequest<any>('GET', targetUrl);
  }

  /**
   * retrieve payment rate settings for a specified date range period
   * @param dateRangeParam - name of the range formatted as YYYYMMDD_YYYYMMDD
   */
  public getPaymentTransferRateList(startDate: Date, endDate: Date): Observable<RefreshData | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/payment-transfer-rate-list';
    return this.http.post(targetUrl,
      { 'startDate': startDate, 'endDate': endDate }, { headers: this._headers }).pipe(
      map((data: any) => {
        return new RefreshData(data, data.length);
      }),
      catchError(error => handleError(error))
    );
  }

  /**
   * retrieve list of available date range periods
   */
  public getPaymentTransferRateRanges(): Observable<any> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/payment-transfer-rate-ranges';
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        data.forEach(item => {
          item.startDate = new Date(item.startDate);
          item.endDate = new Date(item.endDate);
        });
        return data;
      }),
      catchError(error => handleError(error))
    );
  }

  /**
   * retrive the date range, column (valueRanges) and row (countrylist) data for updating
   * @param dateRangeParam - name of the range formatted as YYYYMMDD_YYYYMMDD
   */
  public getPaymentTransferRateDetail(dateRangeParam: string): Observable<PaymentTransferRateSettings | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString +
      '/admin/payment-transfer-rate-detail/' + dateRangeParam;
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        let result: PaymentTransferRateSettings = new PaymentTransferRateSettings(
          new DateRange(new Date(data.dateRange.startDate), new Date(data.dateRange.endDate)),
          data.valueRangeList, data.countryList);
        result.valueRangeList.forEach(item => {
          item = Object.assign(new ValueRange(), item);
        });
        return result;
      }),
      catchError(error => handleError(error))
    );
  }

  /**
   * Get list of countries for which no DSA Rate exist
   */
  public getPaymentTransferRateCountryList(): Observable<Array<Country>> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString +
      '/admin/payment-transfer-rate-country-list';
    return this.http.get<Array<Country>>(targetUrl);
  }

  public setPaymentTransferRateDetail(paymentTransferRateDetail: PaymentTransferRateSettings): Observable<RequestResult> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString +
      '/admin/payment-transfer-rate-detail-set';
    return this.http.post(targetUrl, { 'paymentTransferRateDetail': paymentTransferRateDetail }, { headers: this._headers }).pipe(
      map((data: any) => {
        return Object.assign(new RequestResult(), data);
      }),
      catchError(error => handleError(error))
    );
  }

  public duplicatePaymentTransferRateList(oldStartDate: Date, oldEndDate: Date, newStartDate: Date, newEndDate: Date): Observable<RefreshData | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/payment-transfer-rate-dup';
    return this.http.post(targetUrl,
      { 'oldStartDate': oldStartDate, 'oldEndDate': oldEndDate, 'newStartDate': newStartDate, 'newEndDate': newEndDate }, { headers: this._headers }).pipe(
      map((data: any) => {
        return new RefreshData(data, data.length);
      }),
      catchError(error => handleError(error))
    );
  }

  public savePaymentTransferRateList(startDate: Date, endDate: Date, modifiedListNew: any): Observable<RequestResult> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/payment-transfer-rate-save';
    return this.http.post(targetUrl,
      { 'startDate': startDate, 'endDate': endDate, 'paymentTransferList': modifiedListNew }, { headers: this._headers }).pipe(
      map((data: any) => {
        return Object.assign(new RequestResult(), data);
      }),
      catchError(error => handleError(error))
    );
  }

  public extractPaymentTransferData(startDate: Date, endDate: Date): HttpRequest<any> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/pamentTransfer-list-print/' + startDate + '/' + endDate;
    return new HttpRequest<any>('GET', targetUrl);
  }

  /**
   * Update existing login - email
   * @param oldEmail - old email for which the application forms will be reset
   * @param newEmail - new email for which the application forms will be reset
   */
  public appFormResetLogin(oldEmail: string, newEmail: string): Observable<RequestResult> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/applicationForm/reset-login';
    return this.http.post(targetUrl, { 'oldEmail': oldEmail, 'newEmail': newEmail }, { headers: this._headers }).pipe(
      map((data: any) => {
        return Object.assign(new RequestResult(), data);
      }),
      catchError(error => handleError(error))
    );
  }

  public extractApplicationFormList(sortFilterObject: any): HttpRequest<any> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/applicationFormList-print';
    return new HttpRequest<any>('GET', targetUrl, {
      params: new HttpParams().set('filters', JSON.stringify(sortFilterObject))
    });
  }

  public getCityCountryList(): Observable<Array<Country> | {}> {
    return this.http.get(this.apiBaseUrl + 'cityCountryList').pipe(
      map((data: any) => {
        const countries: Array<Country> = [];

        for (const item of data) {
          countries.push(new Country(item.id, item.countryName));
        }
        return countries;
      }),
      catchError(error => handleError(error))
    );
  }

  public executeJob(reportId: number, userCategoryId: number): Observable<RequestResult | {}> {
    const targetUrl = this.apiBaseUrl + 'job/' + reportId + '/' + userCategoryId;
    return this.http.get<RequestResult>(targetUrl, { headers: this._headers }).pipe(
      catchError(error => handleError(error))
    );
  }

  public getStatisticsJobs(): Observable<RequestResult | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/admin/statistics-jobs';
    return this.http.get(targetUrl).pipe(
      map((requestResult: RequestResult) => {
        const statisticsJobs: Array<StatisticsJobItem> = [];
        for (const item of requestResult.data.rows) {
          statisticsJobs.push(new StatisticsJobItem(item));
        }
        requestResult.data.rows = statisticsJobs;

        return requestResult;
      }),
      catchError(error => handleError(error))
    );
  }
}
