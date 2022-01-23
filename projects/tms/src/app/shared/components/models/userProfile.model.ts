import { EventEmitter } from '@angular/core';

import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { GeneralRoutines } from 'tms-library';

export enum enApplicationType {
  TMS = 1,
  Twinning = 2
}

export enum enUserRoleType {
  NONE = 0,
  IBU_CH = 1,
  TL = 2,
  HoU = 3,
  IBU_Adm = 4,
  IBU_FCH = 25,
  FO = 9,
  CCH = 5,
  LM = 6,
  PD = 8,
  ACH = 21,
  AM = 7,
  TCH = 10    // Ticket CH
}

export enum enUserCategory {
  IBU = 1,
  GIZ = 2,
  IBF_6 = 4,
  NEAR = 8,
  PI = 32,
  REGIO = 64,
  TCC = 128,
  IBF_7 = 256,
  GTZ = 512,
  IBF_GTZ = 1024,
  Carlbro = 2048,
  SRSP = 4096,
  EIR = 8192
}

export enum enRoleType {
  General = 1,
  Dashboard = 2,
  Administrator = 3
}

export enum enUserType {
  EC = 1,
  Contractor = 2
}

export enum enAccessMode {
  Read = 1,
  ReadWrite = 2
}

export class User {
  public userId: string;
  public firstName: string;
  public familyName: string;

  constructor(userId?: string, firstName?: string, familyName?: string) {
    this.userId = GeneralRoutines.hasValue(userId) ? userId : null;
    this.firstName = (firstName) ? firstName : '';
    this.familyName = (familyName) ? familyName : '';
  }

  get name(): string {
    return this.familyName + ' ' + this.firstName;
  }
}

export class BackupUser extends User {
  public backupUserId: string;
  public firstName: string;
  public familyName: string;

  constructor(userId?: string, firstName?: string, familyName?: string, backupUserId?: string) {
    super(userId, firstName, familyName);
    this.backupUserId = backupUserId;
    this.firstName = (firstName) ? firstName : '';
    this.familyName = (familyName) ? familyName : '';
  }

  get backupUserName(): string {
    return this.familyName + ' ' + this.firstName;
  }
}

export class UserRole {
  userRoleId: number;
  description: string;
  abbreviation: string;
  workflowRole: boolean;
  type: enUserRoleType;

  constructor(userRoleId: number, description: string, abbreviation: string, workflowRole: boolean, roleId: number) {
    this.userRoleId = userRoleId;
    this.description = description;
    this.abbreviation = abbreviation;
    this.type = roleId;
    this.workflowRole = workflowRole;
  }
}

export class UserApplication {
  application: enApplicationType;
  userCategory: enUserCategory;

  constructor() {
    // do nothing
  }
}

export class UserProfile extends User {
  public phone: string;
  public email: string;
  public availableActions: Array<Array<string>>;
  public availableApplications: Array<UserApplication>;
  public businessOwner: boolean;
  // user role details
  private _activeUserRole: UserRole;
  // active teamId used by the dashboard
  private _activeTeamId: number;
  public backupUser: BackupUser;

  public userRoleList: Array<UserRole>;
  public activeUserRoleEmitter: EventEmitter<UserRole>;
  public activeTeamIdEmitter: EventEmitter<number>;
  public encryptedUserId: string;
  public contractorProfile: boolean;
  public taiexContractorId: number;
  public validAccount: boolean;

  get activeUserRole(): UserRole {
    return this._activeUserRole;
  }
  set activeUserRole(value: UserRole) {
    this._activeUserRole = value;
    this.activeUserRoleEmitter.emit(this._activeUserRole);
  }
  get activeTeamId(): number {
    return this._activeTeamId;
  }
  set activeTeamId(value: number) {
    this._activeTeamId = value;
    this.activeTeamIdEmitter.emit(this._activeTeamId);
  }

  constructor(userId?: string, firstName?: string, familyName?: string, phone?: string, email?: string, availableActions?: Array< Array<string>>,
              availableApplications?: Array<UserApplication>, backupUserId?: string, backupUserFirstName?: string,
              backupUserFamilyName?: string, businessOwner?: boolean, activeUserRoleId?: number,
              userRoleList?: Array<UserRole>, activeTeamId?: number, encryptedUserId?: string, contractorProfile?: boolean,
              taiexContractorId?: number, validAccount?: boolean) {
    super(userId, firstName, familyName);
    this.activeUserRoleEmitter = new EventEmitter<UserRole>();
    this.activeTeamIdEmitter = new EventEmitter<number>();
    this.updateProfile(userId, firstName, familyName, phone, email, availableActions, availableApplications,
      backupUserId, backupUserFirstName, backupUserFamilyName, businessOwner, activeUserRoleId, userRoleList,
      activeTeamId, encryptedUserId, contractorProfile, taiexContractorId, validAccount);
  }

  public updateProfile(userId?: string, firstName?: string, familyName?: string, phone?: string, email?: string, availableActions?: Array< Array<string>>,
                       availableApplications?: Array<UserApplication>, backupUserId ?: string, backupUserFirstName ?: string,
                       backupUserFamilyName ?: string, businessOwner ?: boolean, activeUserRoleId?: number,
                       userRoleList?: Array<UserRole>, activeTeamId?: number, encryptedUserId?: string, contractorProfile?: boolean,
                       taiexContractorId?: number, validAccount?: boolean): void {
    this.userId = userId;
    this.firstName = firstName;
    this.familyName = familyName;
    this.phone = phone;
    this.email = email;
    this.availableActions = availableActions;
    this.availableApplications = availableApplications;
    this.businessOwner = businessOwner;
    this.backupUser = new BackupUser(userId, backupUserFirstName, backupUserFamilyName, backupUserId);
    this.userRoleList = userRoleList ? _.orderBy(userRoleList, ['description']) : [];
    if (activeUserRoleId && _.filter(this.userRoleList, ['userRoleId', activeUserRoleId])[0]) {
      this.activeUserRole = _.filter(this.userRoleList, ['userRoleId', activeUserRoleId])[0];
    }
    this.activeTeamId = (activeTeamId) ? activeTeamId : -1;
    this.encryptedUserId = (encryptedUserId) ? encryptedUserId : '';
    this.contractorProfile = contractorProfile;
    this.taiexContractorId = taiexContractorId ? taiexContractorId : -1;
    this.validAccount = (validAccount) ? validAccount : false;
  }

  isBusinessOwner(): boolean {
    return this.businessOwner;
  }

  get isLoaded(): boolean {
    return this.availableActions !== undefined;
  }

  public hasAction(appType: enApplicationType, actionName: string): boolean {
    if (this.availableActions && this.availableActions[enApplicationType[appType].toUpperCase()]) {
      let number = this.availableActions[enApplicationType[appType].toUpperCase()].indexOf(actionName);
      return number !== -1;
    }
    return false;
  }

  public hasAnyAction(appType: enApplicationType, roleNames: Array<string>): boolean {
    if (roleNames.length > 0) {
      for (let actionName of roleNames) {
        if (this.hasAction(appType, actionName)) {
          return true;
        }
      }
    }
    return false;
  }

  public hasApplication(appType: enApplicationType): boolean {
    if (this.availableApplications && this.availableApplications.length > 0) {
      for (let app of this.availableApplications) {
        if (app.application === appType) {
          return true;
        }
      }
    }
    return false;
  }

  public hasTMSApplication(): boolean {
    return this.hasApplication(enApplicationType.TMS);
  }

  public hasTwinningApplication(): boolean {
    return this.hasApplication(enApplicationType.Twinning);
  }

  public isIBURole(): boolean {
    return this.activeUserRole.type === enUserRoleType.FO || this.activeUserRole.type === enUserRoleType.IBU_FCH ||
      this.activeUserRole.type === enUserRoleType.HoU || this.activeUserRole.type === enUserRoleType.TL ||
      this.activeUserRole.type === enUserRoleType.IBU_CH;
  }

  public getUserCategory(appType: enApplicationType): enUserCategory {
    if (this.availableApplications) {
      let application = _.filter(this.availableApplications, { 'application': appType });
      return (application.length > 0) ? application[0].userCategory : undefined;
    }
    return undefined;
  }

  public getUserAllRoleDescriptions(): string {
    return _.join(_.map(this.userRoleList, 'description'), ', ');
  }

  public getUserWorkflowRoles(): Array<UserRole> {
    return _.filter(this.userRoleList, function(elem) {
      return elem.workflowRole === true;
    });
  }

  public logOut(): Observable<boolean> {
    this.availableActions = undefined;
    return of(true);
  }

  public hasUserRole(userRoleTypes: enUserRoleType[]): boolean {
    return _.filter(this.userRoleList, (userRole: UserRole) => {
      return userRoleTypes.includes(userRole.type);
    }).length > 0;
  }
}
