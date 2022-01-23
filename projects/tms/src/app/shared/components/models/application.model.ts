import { TranslateService } from '@ngx-translate/core';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Module } from './module.model';
import { enApplicationType, enUserCategory, UserApplication, UserProfile, UserRole } from './userProfile.model';
import { TMSUserService } from '../../../services/user.service';

export class QlikReports {
  qlikSingleEvaluationURL: string;
  qlikEvaluationURL: string;
  qlikFinancialURL: string;
  qlikEDBURL: string;
  qlikTMSOverviewURL: string;
  qlikTwinningURL: string;
}

export class BaseEvent {
  public eventId: number;
  public motherEventId: number;
  public ofStatus: string;
  public evaluationImpactFeedbackResultURL: string;
  public paymentFileURL: string;

  constructor(data: {
    eventId: number,
    motherEventId: number,
    ofStatus: string,
    evaluationImpactFeedbackResultURL: string,
    paymentFileURL: string,
  } = { eventId: -1, motherEventId: -1, ofStatus: '', evaluationImpactFeedbackResultURL: undefined, paymentFileURL: undefined }) {
    Object.assign(this, data);
  }
}

export class Application {
  modules: Array<Module> = [];
  activeModule: Module;
  private _appType: enApplicationType;
  private _selectedEvent: BaseEvent;
  user: UserProfile;
  public routerData: any;               // property used to pass data between routes
  public aresApplicSearchUrl: string = '';
  public qlikViewUrl: string = '';
  public qlikReports: QlikReports;
  public appTypeChanged: Subject<enApplicationType> = new Subject();
  public selectedEventChanged: Subject<any> = new Subject();
  public hasNavBar: boolean = true;
  public hasHeader: boolean = true;

  access: boolean; // temp only, replace by userprofile access

  constructor (translate: TranslateService, public userService: TMSUserService) {
    // add existing modules to the list
    this.modules.push(new Module(enApplicationType[enApplicationType.TMS], translate)); // enum to string
    this.modules.push(new Module(enApplicationType[enApplicationType.Twinning], translate)); // enum to string
    // other settings
    this.selectedEvent = undefined;

    this.user = new UserProfile();
  }

  get appType(): enApplicationType {
    return this._appType;
  }

  set appType(value: enApplicationType) {
    if (this._appType !== value) {
      this._appType = value;
      if (this.user.isLoaded) {
        this.activeModule = this.modules.findFirstByProperty('name', enApplicationType[value]);
        this.appTypeChanged.next(this._appType);
      }
    }
  }

  get selectedEvent(): BaseEvent {
    return this._selectedEvent;
  }

  set selectedEvent(value: BaseEvent) {
    if (this._selectedEvent !== value) {
      this._selectedEvent = value;
      this.selectedEventChanged.next(this._selectedEvent);
    }
  }

  get appTypeString(): String {
    if (this.appType === enApplicationType.TMS) { return 'TMS'; }
    if (this.appType === enApplicationType.Twinning) { return 'TW'; }
    return '';
  }

  public setAppType(url: string) {
    if (url.indexOf('/tms') !== -1) {
      this.appType = enApplicationType.TMS;
    } else if (url.indexOf('/twinning') !== -1) {
      this.appType = enApplicationType.Twinning;
    }
  }

  get appRoutingPath(): String {
    if (this.appType === enApplicationType.TMS) { return 'tms'; }
    if (this.appType === enApplicationType.Twinning) { return 'twinning'; }
    return '';
  }

  get userCategory(): enUserCategory {
    return this.user.getUserCategory(this.appType ? this._appType : enApplicationType.TMS);
  }

  public logIn(): Observable<boolean> {
    return this.userService.getUserProfile().pipe(
      map((result) => {
        this.user.updateProfile(result.userId, result.firstName, result.familyName, result.phone, result.email, result.availableActions,
          result.availableApplications.map((item: any) => Object.assign(new UserApplication(), item)),
          result.backupUserId, result.backupUserFirstName, result.backupUserFamilyName, result.bussinesOwner, result.activeUserRoleId,
          result.userRoleList.map(o => new UserRole(o.userRoleId, o.description, o.abbreviation, o.workflowRole, o.roleId)), result.activeTeamId,
          result.encryptedUserId, result.contractorProfile, result.taiexContractorId, result.validAccount);
        this.activeModule = this.modules.findFirstByProperty('name', enApplicationType[this.appType]);
        this.appTypeChanged.next(this._appType);
        return true;
      })
    );
  }

  public logOut(): Observable<boolean> {
    return this.user.logOut().pipe(
      map((result) => {
        if (result) {
          this.appTypeChanged.next(this.appType);
        }
        return result;
      })
    );
  }
}
