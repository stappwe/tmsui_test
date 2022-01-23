import { Role } from '../../shared/adminitration.model';
import { enRoleType, enUserType } from '../../../../../shared/components/models/userProfile.model';
import { DateRange, GeneralRoutines, IMultiSelectOption } from 'tms-library';
import * as moment from 'moment';
import _ from 'lodash';

export class Property {
  public property: string;
  public value: string;
  public taiexContractorId: number;

  constructor(propertyId?: number, property?: string, value?: string, taiexContractorId?: number) {
    this.property = (property) ? property : '';
    this.value = (value) ? value : '';
    this.taiexContractorId = (taiexContractorId) ? taiexContractorId : 0;
  }
}

export class Project {
  public projectId: number;
  public abbreviation: string;
  public consultation: number; // 0 === false, 1 === true
  public description: string;
  public comment: string;
  public generalEmail: string;
  public signatureEmail: string;
  public signatureEmailOutlook: string;
  public emailRequestValidator: string;

  constructor(projectId?: number, abbreviation?: string, consultation?: number, description?: string, comment?: string,
              generalEmail?: string, signatureEmail?: string, signatureEmailOutlook?: string, emailRequestValidator?: string) {
    this.projectId = (projectId) ? projectId : -1;
    this.abbreviation = (abbreviation) ? abbreviation : '';
    this.consultation = (consultation) ? consultation : 0;
    this.description = (description) ? description : '';
    this.comment = (comment) ? comment : '';
    this.generalEmail = (generalEmail) ? generalEmail : '';
    this.signatureEmail = (signatureEmail) ? signatureEmail : '';
    this.signatureEmailOutlook = (signatureEmailOutlook) ? signatureEmailOutlook : '';
    this.emailRequestValidator = (emailRequestValidator) ? emailRequestValidator : '';
  }
}

export class ProcedureRecipients {
  public procedureRecipientsId: number;
  public procedureId: number;
  public description: string;
  public functionEmail: string;
  public taiexContractorId: number;
  public userId: string;

  constructor(procedureRecipientsId?: number, procedureId?: number, description?: string, functionEmail?: string,
              taiexContractorId?: number, userId?: string) {
    this.procedureRecipientsId = (procedureRecipientsId) ? procedureRecipientsId : -1;
    this.procedureId = (procedureId) ? procedureId : -1;
    this.description = (description) ? description : '';
    this.functionEmail = (functionEmail) ? functionEmail : '';
    this.taiexContractorId = (taiexContractorId) ? taiexContractorId : 0;
    this.userId = (userId) ? userId : '';
  }
}

export class EventType {
  public eventTypeId: number;
  public abbreviation: string;
  public description: string;
  public active: boolean;
  public status: boolean;
  public taiexPublish: boolean;
  public edbPublish: boolean;
  public agendaRequired: boolean;
  public budgetTeamId: number;
  public eventCategoryId: number;
  public userId: string;   // team leader
  public evaluationRequired: boolean;

  constructor(eventTypeId?: number, abbreviation?: string, description?: string, active?: boolean, status?: boolean,
              taiexPublish?: boolean, edbPublish?: boolean, agendaRequired?: boolean, budgetTeamId?: number,
              eventCategoryId?: number, userId?: string, evaluationRequired?: boolean) {
    this.eventTypeId = (eventTypeId) ? eventTypeId : -1;
    this.abbreviation = (abbreviation) ? abbreviation : '';
    this.description = (description) ? description : '';
    this.active = (active) ? active : false;
    this.status = (status) ? status : false;
    this.taiexPublish = (taiexPublish) ? taiexPublish : false;
    this.edbPublish = (edbPublish) ? edbPublish : false;
    this.agendaRequired = (agendaRequired) ? agendaRequired : false;
    this.budgetTeamId = (budgetTeamId) ? budgetTeamId : 0;  // not applicable, optional foreign key
    this.eventCategoryId = (eventCategoryId) ? eventCategoryId : 0;   // not applicable, optional foreign key
    this.userId = (userId) ? userId : '';
    this.evaluationRequired = (evaluationRequired) ? evaluationRequired : false;
  }
}

export class EventTypeItem extends EventType {
  public budgetTeam: string;
  public eventCategory: string;
}

export class RoleItem extends Role {
  private _userCategoryList: string;
  public userCategoryListTooltip: string;
  public canDelete: number;

  get userCategoryList(): string {
    return this._userCategoryList;
  }
  set userCategoryList(value: string) {
    this._userCategoryList = value;
    this.userCategoryListTooltip = value.toTooltip(',');
  }
}

export class RoleDetail extends Role {
  public userCategoryList: Array<number>;

  public myRole() {
    const i = 5;
  }
}

export class UserCategory implements IMultiSelectOption {
  userCategoryId: number;
  abbreviation: string;
  userType: enUserType;

  get id(): number {
    return this.userCategoryId;
  }

  get name(): string {
    return this.abbreviation;
  }
}

export class Action {
  actionId: number;
  description: string;
  abbreviation: string;

  constructor(actionId?: number, description?: string, abbreviation?: string) {
    this.actionId = (actionId) ? actionId : -1;
    this.description = (description) ? description : '';
    this.abbreviation = (abbreviation) ? abbreviation : '';
  }
}

export class ActionItem extends Action {
  canDelete: boolean;
}

export class ActionRole {
  roleId: number;
  description: string;
  roleType: enRoleType;
  selected: number;
}

export class ActionRoles extends Action {
  public roles: Array<ActionRole> = [];
}

export class ValueRange {
  from: number;
  to: number;
}

export class PaymentTransferRateSettings {
  dateRange: DateRange;
  valueRangeList: Array<ValueRange>;
  countryList: Array<number>;

  constructor(dateRange: DateRange = new DateRange(), valueRangeList: Array<ValueRange> = [], countryList: Array<number> = []) {
    this.dateRange = dateRange;
    this.valueRangeList = valueRangeList;
    this.countryList = countryList;
  }
}

export class StatisticsJobItem {
  name: string;
  description: string;
  createDate: moment.Moment;
  userCategoryId: number;
  userCategory: string;  // completed on the clientside based on the gridFilters
  reportId: number;

  get displayCreateDate(): string {
    return GeneralRoutines.isNullOrUndefined(this.createDate) ? '' : GeneralRoutines.displayInBrusselsTimezone(this.createDate);
  }

  constructor(data: {
    name: string,
    description: string,
    createDate: moment.Moment | string,
    userCategoryId: number,
    reportId: number
  } = { name: '', description: '', createDate: null, userCategoryId: undefined, reportId: undefined }) {
    if (data !== null) {
      Object.assign(this, data);
      this.createDate = GeneralRoutines.isNullOrUndefined(data.createDate) ? undefined : moment.utc(data.createDate);
    }
  }

  public update(userCategory: Array<IMultiSelectOption> = []): void {
    // userCategory
    this.userCategory = _.find(userCategory, ['id', this.userCategoryId])?.name;
  }
}
