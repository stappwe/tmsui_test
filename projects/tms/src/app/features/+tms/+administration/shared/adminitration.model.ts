import { enRoleType, User } from '../../../../shared/components/models/userProfile.model';
import { MultiSelectOption } from 'tms-library';

export enum enArchivePKType {
  Person = 1,
  Supplier = 2,
  KeyContact = 3,
  Task = 4,
  Event = 5,
}

export namespace enArchivePKType {
  export function values() {
    return Object.keys(enArchivePKType).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}

export class UserItem extends User {
  private _userRoles: string;
  private _visibleAsUserList: string;
  private _applicationList: string;
  private _userCategoryList: string;

  public email: string;
  public phone: string;
  public active: boolean;    // Active or inactive user
  public userRolesAbbr: string;
  public defaultRoleAbbr: string;
  public defaultRole: string;
  public activeRoleAbbr: string;
  public activeRole: string;
  public visibleAsUserListAbbr: string;
  public backupUserId: string;
  public applicationListAbbr: string;
  public userCategory: string;
  public updateDate: Date;
  public updatedBy: string;
  public canDelete: boolean;

  constructor(userId?: string, firstName?: string, familyName?: string) {
    super(userId, firstName, familyName);
  }

  get userRoles(): string {
    return this._userRoles;
  }
  set userRoles(value: string) {
    this._userRoles = value !== null ? value.toTooltip(',') : '';
  }

  get visibleAsUserList(): string {
    return this._visibleAsUserList;
  }
  set visibleAsUserList(value: string) {
    this._visibleAsUserList = value !== null ? value.toTooltip(',') : '';
  }

  get applicationList(): string {
    return this._applicationList;
  }
  set applicationList(value: string) {
    this._applicationList = value !== null ? value.toTooltip(',') : '';
  }

  get userCategoryList(): string {
    return this._userCategoryList;
  }
  set userCategoryList(value: string) {
    this._userCategoryList = value != null ? value.toTooltip(',') : '';
  }
}

export class Role {
  roleId: number;
  description: string;
  abbreviation: string;
  roleType: enRoleType;
  roleFixed: number;
  order: number;

  constructor(roleId?: number, description?: string, abbreviation?: string, roleType?: number, roleFixed?: number) {
    this.roleId = (roleId) ? roleId : -1;
    this.description = (description) ? description : '';
    this.abbreviation = (abbreviation) ? abbreviation : '';
    this.roleType = (roleType) ? roleType : enRoleType.General;
    this.roleFixed = (roleFixed) ? roleFixed : 0;
  }
}

export class RoleUserRole extends Role {
  userRoleId: number;             // -1 = not selected else userRoleId is defined
  accessMode: number;             // 1 = read 2 = read/write
  defaultRole: number;
  activeRole: number;
  deleteUserRoleId: number = -1;  // remember userRole ID for two purposes:
                                   //   1. reset if needed the value
                                   //   2. afterward to check which should be deleted
                                   // -1 = no action, value > 0 = delete specified uerRoleId
  get id(): number {
    return this.roleId;
  }
  get name(): string {
    return this.description;
  }
}

export class ApplicationSettings {
  public userCategory: number;
  public roles: Array<RoleUserRole> = [];
  public defaultRole: number;
  public activeRole: number;
  public visibleAsUserList: Array<number> = [];
}

export class UserDetail extends User {
  public email: string;
  public phone: string;
  public active: boolean = false;    // Active or inactive user
  public tms: ApplicationSettings;
  public twinning: ApplicationSettings;
  public applicationAccess: Array<number> = [];
  public backupUserId: string;

  constructor(userId?: string, firstName?: string, familyName?: string, email?: string, phone?: string, active?: boolean) {
    super(userId, firstName, familyName);

    this.email = email;
    this.phone = phone;
    this.active = active;
    this.tms = new ApplicationSettings();
    this.twinning = new ApplicationSettings();
  }
}

export class IdSelection extends MultiSelectOption {
  public selected: boolean;
}
