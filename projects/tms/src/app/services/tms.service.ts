import { forwardRef, Inject, Injectable, Injector } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EUI_CONFIG_TOKEN, EuiConfig, handleError, UxAppShellService } from '@eui/core';
import * as _ from 'lodash';

import { enUserRoleType, User } from '../shared/components/models/userProfile.model';
import { AppService, enPKType } from './app.service';
import { BaseService, ChapterSelectedList, Country, enAlert, GeneralRoutines, IMultiSelectOption, MultiSelectOption, RefreshData,
  RequestResult } from 'tms-library';
import { CaseHandler, enTaskWorkflowStep, IEventType, TaskDetail, InvoiceQuarter, TaiexContractor, enWorkflowStep } from '../features/+tms/shared/tms.model';
import * as moment from 'moment';

@Injectable()
export class TMSService extends BaseService {

  private taskBeneficiaryCountryList: any;
  private projectsList: any;
  private taskPlaceCountryList: any;
  private eventPlaceCountryList: any;
  private proposedActionList: any;
  private taskDecisionsList: any;
  private teamLeaderList: any;
  private eventTypeList: any;

  constructor(http: HttpClient, uxAppShellService: UxAppShellService,
              @Inject(forwardRef(() => AppService)) public appService: AppService, injector: Injector) {
    super(http, uxAppShellService, injector);
  }

  public hasAction(actionName: string): boolean {
    return this.appService.hasAction(actionName);
  }

  /**
   * extract the url to retrieve the print docuemnts
   * @param type - 1: for city list, 2: for participant list...
   * @param sortFilterObject - sort and filters applied on the UI, internal and external
   */
  public extractData(type: number, sortFilterObject: any): HttpRequest<any> {
    let link;
    if (type === 1) {
      link = this.apiBaseUrl + this.appService.application.appTypeString + '/cityList-print';
    } else if (type === 2) {
      link = this.apiBaseUrl + this.appService.application.appTypeString + '/participantList-print';
    } else if (type === 3) {
      link = this.apiBaseUrl + this.appService.application.appTypeString + '/amadeusList-print';
    } else if (type === 4) {
      link = this.apiBaseUrl + this.appService.application.appTypeString + '/my-registration-list-print';
    } else if (type === 5) {
      link = this.apiBaseUrl + this.appService.application.appTypeString + '/my-registration-list-invite-print';
    } else if (type === 6) {
      link = this.apiBaseUrl + this.appService.application.appTypeString + '/add-participant-list-print';
    } else if (type === 7) {
      link = this.apiBaseUrl + this.appService.application.appTypeString + '/expert-registration-list-invite-print';
    }

    let request: HttpRequest<any> = new HttpRequest<any>('GET', link);
    if (sortFilterObject !== undefined) {
      request = new HttpRequest<any>('GET', link, {
        params: new HttpParams().set('filters', encodeURIComponent(JSON.stringify(sortFilterObject)))
      });
    }

    return request;
  }

  public getAmadeusUploadUrl(): string {
    return this.apiBaseUrl + this.appService.application.appTypeString + '/amadeusList-upload';
  }

  public processAmadeusFiles(files: any): Observable<RequestResult | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/amadeusList-process';
    const dto = JSON.stringify(files);

    return this.http.post<RequestResult>(targetUrl, dto, { headers: this._headers }).pipe(
      catchError((error: any) => handleError(error))
    );
  }

  public deleteUnprocessedFiles(): Observable<boolean | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/amadeus-clear-unprocessed/';
    return this.http.get<boolean>(targetUrl).pipe(
      catchError((error: any) => handleError(error))
    );
  }

  public getListOfUsers(usertype: enUserRoleType): Observable<Array<User>> {
    let targetUrl = '';
    switch (usertype) {
    case enUserRoleType.ACH:
      targetUrl = this.apiBaseUrl + 'dashboard/get-account-coCaseHandlers';
      break;
    }
    // get list
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        return data.map((item: any) => Object.assign(new User(), item));
      }),
      catchError((error: any) => handleError(error))
    );
  }

  public extractInvoiceBudgetContractReport(taiexContractorId: number, invoiceDate: String): HttpRequest<any> {
    let targetURL: string;
    if (invoiceDate !== undefined && invoiceDate !== null) {
      targetURL = this.apiBaseUrl + this.appService.application.appTypeString +
        '/financial/invoiceBudgetContract/invoice-budgetContract-report' + '/' + taiexContractorId + '/' + invoiceDate;
    } else {
      targetURL = this.apiBaseUrl + this.appService.application.appTypeString +
        '/financial/invoiceBudgetContract/invoice-budgetContract-report' + '/' + taiexContractorId;
    }
    return new HttpRequest<any>('GET', targetURL);
  }

  public extractBlankChecklist(invoiceQuarter: String): HttpRequest<any> {
    return new HttpRequest<any>('GET', this.apiBaseUrl + 'dashboard/blankChecklist?invoiceQuarter=' + invoiceQuarter);
  }

  public extractInvEventsExcel(invoiceDate: string, invoicePeriod: string, taiexContractorId: number): HttpRequest<any> {
    return new HttpRequest<any>('GET', this.apiBaseUrl + this.appService.application.appTypeString
      + '/invEventsExcel-print?'
      + 'userRoleId=' + this.appService.application.user.activeUserRole.userRoleId
      + '&invDate=' + invoiceDate.replace(/\//gi, '_')
      + '&invPeriod=' + invoicePeriod
      + '&taiexContractorId=' + taiexContractorId);
  }

  public checkStatisticsReport(templateId: number): Observable<boolean> {
    return this.http.get<boolean>(this.apiBaseUrl + this.appService.application.appTypeString + '/statistics/check-exist-report/' + templateId);
  }

  public downloadStatisticsReport(templateID: number): string {
    switch (templateID) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      return this.apiBaseUrl + this.appService.application.appTypeString + '/statistics/download-statistics-report' + '/' + templateID;
    case 10:
      return this.apiBaseUrl + this.appService.application.appTypeString + '/statistics/download-commitments-by-event';
    case 11:
      return this.apiBaseUrl + this.appService.application.appTypeString + '/statistics/download-commitments-by-event-country';
    case 31:
      return this.apiBaseUrl + this.appService.application.appTypeString + '/statistics/download-meeting-planner';
    case 32:
      return this.apiBaseUrl + this.appService.application.appTypeString + '/statistics/download-accommodation';
    case 33:
      return this.apiBaseUrl + this.appService.application.appTypeString + '/statistics/download-catering';
    case 34:
      return this.apiBaseUrl + this.appService.application.appTypeString + '/statistics/download-conference';
    case 35:
      return this.apiBaseUrl + this.appService.application.appTypeString + '/statistics/download-VLS';
    }
  }

  /**
   * Get list of possible task decision values
   */
  public getTaskDecisionList(): Observable<Array<IMultiSelectOption> | {}> {
    if (this.taskDecisionsList === undefined) {
      return this.http.get(this.apiBaseUrl + this.appService.application.appTypeString + '/tasks/task-decisions/').pipe(
        map((data: any) => {
          const output: Array<MultiSelectOption> = [];
          for (const item of data) {
            const opt = new MultiSelectOption(item.id, item.name);
            if (opt.id === -1) { opt.id = 0; }
            output.push(opt);
          }
          this.taskDecisionsList = output;
          return output;
        }),
        catchError((error: any) => handleError(error))
      );
    } else {
      return of(this.taskDecisionsList);
    }
  }

  public getApprovalTaskDecisionList(): Observable <Array<IMultiSelectOption> | {}> {
    return this.http.get(this.apiBaseUrl + 'dashboard/approval-task-decisions/').pipe(
      map((data: any) => {
        const output: Array<MultiSelectOption> = [];
        for (const item of data) {
          const opt = new MultiSelectOption(item.id, item.name);
          if (opt.id === -1) { opt.id = 0; }
          output.push(opt);
        }
        return output;
      }),
      catchError((error: any) => handleError(error))
    );
  }

  /**
   * Retrieve the workflow comment for the specified task or event
   * @param type - PK type: Task or Event
   * @param id - Depending on the type Task or Event
   */
  public getWorkflowComments(type: enPKType, id: number): Observable<RefreshData | {}> {
    return this.http.get(this.apiBaseUrl + 'dashboard/workflow-comments/' + type + '/' + id).pipe(
      map((data: any) => {
        return { rows: data, rowCount: data.length };
      }),
      catchError((error: any) => handleError(error))
    );
  }

  public extractWorkflowComments(workflowType: enPKType, eventId: number): string {
    return this.apiBaseUrl + 'workflow-comments-print/' + workflowType + '/' + eventId;
  }

  public getTaskDetail(taskId: number): Observable<TaskDetail | {}> {
    if (taskId !== -1) {
      return this.http.get(this.apiBaseUrl + this.appService.application.appTypeString + '/tasks/details/'
        + this.appService.application.user.activeUserRole.userRoleId + '/'
        + taskId).pipe(
        map((data) => {
          return this.mergeTaskDetails(new TaskDetail(), data);
        }),
        catchError((error: any) => handleError(error))
      );
    } else {
      return this.getAllowedWorkflowActionsTask(-1).pipe(
        map((allowedWorkflowActions: any) => {
          const newTaskDetails: TaskDetail = new TaskDetail();
          newTaskDetails.allowedWorkflowActions = allowedWorkflowActions;
          return newTaskDetails;
        })
      );
    }
  }

  /**
   * Save task detail and optional, if needed a workflow step
   * @param taskDetail - task detail to be saved (taskId = -1 -> Insert)
   * @param taskWorkflowStep - task workflow step to execute
   * @param comment - Comment which is required in case of refusal   *
   * @returns result - Object containing the result, message and alert type
   */
  public setTaskDetail(taskDetail: TaskDetail, taskWorkflowStep: enTaskWorkflowStep = null,
                       comment: string = null): Observable<RequestResult> {
    taskDetail.nextWorkflowStep = taskWorkflowStep;
    taskDetail.workflowComment = comment;

    return this.http.post(this.apiBaseUrl + this.appService.application.appTypeString + '/tasks/update/'
      + this.appService.application.user.activeUserRole.userRoleId, taskDetail, { headers: this._headers }).pipe(
      map((resultData: any) => {
        if (resultData.data.taskDetail) {
          resultData.data.taskDetail = this.mergeTaskDetails(new TaskDetail(), resultData.data.taskDetail);
        }
        return resultData;
      }),
      catchError((error: any) => handleError(error))
    );
  }

  /**
   * Get the Teamleader list
   */
  public getTeamLeaderList(): Observable<Array<IMultiSelectOption> | {}> {
    if (this.teamLeaderList === undefined) {
      return this.http.get(this.apiBaseUrl + this.appService.application.appTypeString + '/tasks/task-team-leaders').pipe(
        map((data: any) => {
          const teamleaders: Array<MultiSelectOption> = [];
          for (const item of data) {
            teamleaders.push(new MultiSelectOption(item.userId, item.familyName + ' ' + item.firstName));
          }
          this.teamLeaderList = teamleaders;
          return teamleaders;
        }),
        catchError((error: any) => handleError(error))
      );
    } else {
      return of(this.teamLeaderList);
    }
  }

  /**
   * Retrieve list of proposed actions
   */
  public getProposedActionList(): Observable<Array<IMultiSelectOption> | {}> {
    if (this.proposedActionList === undefined) {
      return this.http.get(this.apiBaseUrl + this.appService.application.appTypeString + '/tasks/proposed-actions').pipe(
        map((data: any) => {
          const output: Array<MultiSelectOption> = [];
          for (const item of data) {
            output.push(new MultiSelectOption(item.id, item.name));
          }
          this.proposedActionList = output;
          return output;
        }),
        catchError((error: any) => handleError(error))
      );
    } else {
      return of(this.proposedActionList);
    }
  }

  /**
   * Get the event type list
   */
  public getEventTypeList(): Observable<Array<IEventType>> {
    if (this.eventTypeList === undefined) {
      return this.http.get(this.apiBaseUrl + this.appService.application.appTypeString + '/tasks/event-types').pipe(
        map((data: any) => {
          this.eventTypeList = data;
          return data;
        }),
        catchError((error: any) => handleError(error))
      );
    } else {
      return of(this.eventTypeList);
    }
  }

  /**
   * Get the project list
   */
  public getProjectList(): Observable<Array<IMultiSelectOption> | {}> {
    if (this.projectsList === undefined) {
      return this.http.get(this.apiBaseUrl + this.appService.application.appTypeString + '/tasks/projects').pipe(
        map((data: any) => {
          const projects: Array<MultiSelectOption> = [];
          for (const item of data) {
            projects.push(new MultiSelectOption(item.id, item.name));
          }
          this.projectsList = projects;
          return projects;
        }),
        catchError((error: any) => handleError(error))
      );
    } else {
      return of(this.projectsList);
    }
  }

  /**
   * Get the task beneficiary country list
   */
  public getProjectBeneficiaryCountryList(): Observable <Map<Number, Array<IMultiSelectOption>> | {}> {
    if (this.taskBeneficiaryCountryList === undefined) {
      return this.http.get(this.apiBaseUrl + this.appService.application.appTypeString
        + '/tasks/task-beneficiary-countries').pipe(
        map((data: any) => {
          const projects: Map<Number, Array<MultiSelectOption>> = new Map();

          let i = 1;
          _.each(data, list => {
            if (!projects[i]) {
              projects[i] = new Array();
            }

            for (const item of list) {
              projects[i].push(new MultiSelectOption(item.id, item.name));
            }
            i++;
          });
          this.taskBeneficiaryCountryList = projects;
          return projects;
        }),
        catchError((error: any) => handleError(error))
      );
    } else {
      return of(this.taskBeneficiaryCountryList);
    }
  }

  /**
   * Get the task or event place country list
   */
  public getPlaceCountryList(eventLink: boolean = false): Observable<Array<IMultiSelectOption> | {}> {
    const placeCountryList = (eventLink === true) ? this.eventPlaceCountryList : this.taskPlaceCountryList;
    if (placeCountryList === undefined) {
      return this.http.get(this.apiBaseUrl + this.appService.application.appTypeString
        + (eventLink === true ? '/events/event-place-countries' : '/tasks/task-place-countries')).pipe(
        map((data: any) => {
          const output: Array<MultiSelectOption> = [];
          for (const item of data) {
            output.push(new MultiSelectOption(item.id, item.name));
          }
          if (eventLink === true) {
            this.eventPlaceCountryList = output;
          } else {
            this.taskPlaceCountryList = output;
          }
          return output;
        }),
        catchError((error: any) => handleError(error))
      );
    } else {
      return of(placeCountryList);
    }
  }

  /**
   * Extract the citylist based on the selected filter
   * @param countryId - country id from where to extract cities
   * @param search - return items which contains the specified search string case insensitive
   */
  public getCities(countryId: number, search: string = ''): Observable<Array<MultiSelectOption> | {}> {
    if (!GeneralRoutines.isNullOrUndefined(countryId) && countryId !== -1) {
      return this.http.get(this.apiBaseUrl + this.appService.application.appTypeString + '/tasks/task-cities/' + countryId +
        '?search=' + search).pipe(
        map((data: any) => {
          const cities: Array<MultiSelectOption> = [];

          for (const item of data) {
            cities.push(new MultiSelectOption(item.id, item.name));
          }

          return cities;
        }),
        catchError(error => handleError(error))
      );
    } else {
      return of([]);
    }
  }

  public sendAcknowledgeLetter(taskId: number): Observable<RequestResult | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/tasks/send-acknowledge-letter/'
      + this.appService.application.user.activeUserRole.userRoleId + '/' + taskId;
    return this.http.get<RequestResult>(targetUrl).pipe(
      catchError((error: any) => handleError(error))
    );
  }

  public sendConsultationMailCheck(taskId: number): Observable<RequestResult | {}> {
    return this.http.get<RequestResult>(this.apiBaseUrl + 'mail/' + this.appService.application.appTypeString + '/consultation-email-check/'
      + taskId).pipe(
      catchError((error: any) => handleError(error))
    );
  }

  public getAllowedWorkflowActionsTask(taskId: number): Observable<Array<number> | {}> {
    return this.http.get<Array<number>>(this.apiBaseUrl + this.appService.application.appTypeString + '/tasks/allowed-workflow-actions/'
      + this.appService.application.user.activeUserRole.userRoleId + '/' + taskId).pipe(
      catchError((error: any) => handleError(error))
    );
  }

  public printApprovalForm(taskid: number) {
    window.open(this.apiBaseUrl + 'docs/web/10/' + taskid + '/'
      + this.appService.application.user.activeUserRole.userRoleId + '/pdf', '_self');
  }

  public deleteTaskApproval(taskDetail: TaskDetail) {
    return this.http.delete( this.apiBaseUrl + 'dashboard/' + this.appService.application.appTypeString
      + '/task-approval/' + this.appService.application.user.activeUserRole.userRoleId + '?jwt=' + taskDetail.jwt).pipe(
        catchError((error: any) => handleError(error))
      );
  }

  public getCaseHandlerList(usertype: enUserRoleType = enUserRoleType.NONE): Observable<Array<CaseHandler>> {
    let targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/get-case-handler-list/' + usertype;
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        return data.map((item: any) => new CaseHandler(item));
      }),
      catchError((error: any) => handleError(error))
    );
  }

  public getActiveCaseHandlerList(eventId: number): Observable<Array<CaseHandler>> {
    let targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/get-active-casehandler-list/' + (eventId === null ? -1 : eventId);
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        return data.map((item: any) => new CaseHandler(item));
      }),
      catchError((error: any) => handleError(error))
    );
  }

  /**
   * Retrieve list of all available quarters
   * @param {boolean} [onlyOpenQuarters=false] - true when only invoice quarters for which the invoice is not submitted should be displayed
   * @param withNotInvoiced - if true "Not Invoiced" item will be included
   * @param withBlankItem - if true blank item will be inserted
   * @returns {Observable<Array<InvoiceQuarter>>} result set with "invoicePeriod - description, invoiceDate - startdate quarter, taiexContractor
   */
  public getInvoiceQuarters(onlyOpenQuarters: boolean = false, withNotInvoiced: boolean = true,
                            withBlankItem: boolean = false): Observable<Array<InvoiceQuarter> | {}> {
    let targetUrl = '';
    if (onlyOpenQuarters) {
      targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/open-invoice-quarters/';
    } else {
      targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/invoice-quarters/';
    }
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const invoiceQuarters: Array<InvoiceQuarter> = [];

        if (withNotInvoiced === true) {
          invoiceQuarters.push(new InvoiceQuarter({ invoicePeriod: 'Not Invoiced', invoiceDate: '', taiexContractor: -1 }));
        }
        if (withBlankItem === true) {
          invoiceQuarters.push(new InvoiceQuarter());
        }
        for (const item of data) {
          invoiceQuarters.push(new InvoiceQuarter(item));
        }

        return invoiceQuarters;
      }),
      catchError((error: any) => handleError(error))
    );
  }

  public getAFInfoList(): Observable<Array<MultiSelectOption> | {}> {
    let targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/af-info-list';
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const afInfoList: Array<MultiSelectOption> = [];
        for (const item of data) {
          afInfoList.push(new MultiSelectOption(item.id, item.name));
        }
        return afInfoList;
      }),
      catchError((error: any) => handleError(error))
    );
  }

  public getSeriesOfEvents(onlyActive: boolean = false): Observable<{ rows: Array<IMultiSelectOption>, rowCount: number } | {}> {
    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/series-event-list/' + onlyActive;
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const seriesOfEvents: Array<IMultiSelectOption> = [];
        for (const item of data) {
          seriesOfEvents.push(Object.assign(new MultiSelectOption(), item));
        }
        return { rows: seriesOfEvents, rowCount: seriesOfEvents.length };
      }),
      catchError(error => handleError(error))
    );
  }

  public userGeneratedChecklist(eventId: number): Observable<any> {
    const targetUrl = this.apiBaseUrl + 'dashboard/use-generated-checklist' + '/' + eventId;
    return this.http.get(targetUrl, { responseType: 'text' }).pipe(
      catchError((error: any) => handleError(error))
    );
  }

  /**
   * Saving of the executed workflow step by the actor
   * @param {number} eventIds - one or more event Id's
   * @param {enWorkflowStep} workflowStep - Workflow step to execute
   * @param {string} comment - Comment which is required in case of refusal
   * @returns {<RequestResult>} result - Object containing the result, message and alert type
   */
  public saveWorkflowStep(eventId: number, workflowStep: enWorkflowStep, comment: string): Observable<RequestResult | {}> {
    return this.http.post(this.apiBaseUrl + 'dashboard/set-workflow-step/' +
      this.appService.application.user.activeUserRole.userRoleId
      , {
        'id': eventId,
        'workflowStep': workflowStep,
        'comment': comment
      }, { headers: this._headers, responseType : 'text' }).pipe(
      map((resultData: any) => {
        if (resultData !== undefined) {
          let finalData: RequestResult = JSON.parse(resultData);
          return new RequestResult(finalData.result, finalData.message, finalData.messageType, finalData.data);
        } else {
          return new RequestResult(false, 'no data', enAlert.danger, eventId);
        }
      }),
      catchError((error: any) => handleError(error))
    );
  }

  // @ts-ignore
  public createDraftEmail(selectedIds: Array<number>, emailType: enEmailType, eventId?: number): HttpRequest<any> {
    const queryParameters = new HttpParams()
      .set('selectedIds', JSON.stringify(selectedIds))
      .set('emailType', String(emailType))
      .set('eventId', (eventId ? String(eventId) : '-1') );

    const targetUrl = this.apiBaseUrl + this.appService.application.appTypeString + '/PAX/event/send-draft-email';

    let request: HttpRequest<any> = new HttpRequest<any>('GET', targetUrl, { search : queryParameters });
    if (selectedIds !== undefined) {
      request = new HttpRequest<any>('GET', targetUrl, { params : queryParameters });
    }
    return request;
  }

  private mergeTaskDetails(existingTaskDetail: TaskDetail, data: any): TaskDetail {

    const taskDetail: TaskDetail = Object.assign(existingTaskDetail, data);

    taskDetail.proposedDate = (data['proposedDate'] !== undefined && data['proposedDate'] !== null)
      ? new Date(data['proposedDate']) : undefined;
    taskDetail.createDate = (data['createDate'] !== undefined && data['createDate'] !== null) ? new Date(data['createDate']) : undefined;
    taskDetail.submissionDate = (data['submissionDate'] !== undefined && data['submissionDate'] !== null)
      ? new Date(data['submissionDate']) : undefined;
    taskDetail.holdingLetterDate = (data['holdingLetterDate'] !== undefined && data['holdingLetterDate'] !== null)
      ? new Date(data['holdingLetterDate']) : undefined;
    taskDetail.consultationDate = (data['consultationDate'] !== undefined && data['consultationDate'] !== null)
      ? new Date(data['consultationDate']) : undefined;
    taskDetail.decisionDate = (data['decisionDate'] !== undefined && data['decisionDate'] !== null)
      ? new Date(data['decisionDate']) : undefined;
    taskDetail.answerDate = (data['answerDate'] !== undefined && data['answerDate'] !== null)
      ? new Date(data['answerDate']) : undefined;
    taskDetail.expertise = new ChapterSelectedList(data.expertise ? data.expertise._items : undefined);

    return taskDetail;
  }
}
