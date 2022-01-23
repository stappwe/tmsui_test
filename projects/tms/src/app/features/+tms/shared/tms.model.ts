import { ChapterSelectedList, IMultiSelectOption, Keyword, MultiSelectOption } from 'tms-library';
import { enUserRoleType } from '../../../shared/components/models/userProfile.model';
import * as moment from 'moment';

export enum enWorkflowStep {
  DE = 0,
  AF_F = 1,
  AF_S = 3,
  AF_U = 4,
  TL_A = 9,
  TL_R = 10,
  OF_S = 12,
  OF_U = 13,
  ER_S = 14,
  ER_U = 15,
  AE = 19,
  AF_TL_A = 20,
  AF_TL_R = 21,
  AF_R = 22,
  LO_S = 23,
  LO_F = 24,
  OF_R = 28,
  ER_AC_F = 30,
  ER_AC_A = 31,
  ER_AC_R = 32,
  ER_AC_S = 25,
  ER_CC_F = 33,
  ER_TC_A = 34,
  ER_R = 35,
  CH_A = 37,
  CH_R = 38,
  ER_TC_R = 39,
  ER_FC_A = 40,
  ER_FC_RA = 41,
  ER_FC_RC = 42
}

export enum enTaskWorkflowStep {
  TA_I = 101,
  TA_AL = 102,
  TA_F = 103,
  TA_S = 104,
  TA_R = 105,
  TA_C = 106,
  TA_U = 107,
}

export enum enApprovalFormType {
  none = 0,
  online = 1,
  document = 2
}

export enum enImplementationType {
  onTheSpot = 1,
  online = 2,
  hybrid= 3
}

export const cImplementationTypeList: Array<IMultiSelectOption> = [{ id: 1, name: 'On the spot' }, { id: 2, name: 'Online' }, { id: 3, name: 'Hybrid' }];

export class InvoiceQuarter {
  invoicePeriod: string;
  invoiceDate: string;
  taiexContractor: number;

  constructor (data: {
    invoicePeriod: string,
    invoiceDate: string,
    taiexContractor: number,
  } = { invoicePeriod: '', invoiceDate: '', taiexContractor: -1 }) {
    Object.assign(this, data);
  }
}

export class CaseHandler {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: enUserRoleType = enUserRoleType.NONE;

  constructor(data: {
    id: string,
    name: string,
    email: string,
    phone: string;
    type: enUserRoleType
  } = { id: '', name: '', email: '', phone: '', type: enUserRoleType.NONE }) {
    if (data !== null) {
      Object.assign(this, data);
      this.type = data ? data.type as enUserRoleType : enUserRoleType.NONE;
    }
  }

  public static createNullItem(type: enUserRoleType): CaseHandler {
    return new CaseHandler({ id: null, name: ' ', email: null, phone: null, type: type });
  }
}

export class TaskDetail {
  // task properties
  public taskId: number;
  public description: string;
  public requester: string;
  public institutionName: string;
  public requesterEmail: string;
  public requesterPhone: string;
  public requestId: number;            // -1 = does not exist
  public proposedDate: Date;
  public proposedActionId: number;
  public comment: string;
  public deadlineDate: string;

  // event related properties
  public eventIdList: Array<number>;   // list of events to which this task is linked
  public allowedWorkflowActions: Array<number>;
  public teamLeaderId: number;               // teamLeader user id
  public teamLeaderFamilyName: string;
  public teamLeaderFirstName: string;
  public eventTypeId: number;          // task event type id
  public eventTypeName: string;
  public projectId: number;
  public beneficiaryId: number;        // beneficiary country id
  public beneficiaryCountryName: string;
  public evalCorrEmail: string;        // evaluation corresponden email
  public expertise: ChapterSelectedList;
  public keywords: Array<Keyword>; // unique stored keyword list
  public placeCountryId: number;       // event Country id where the event task place
  public cityId: number;               // city where event task place
  public city: IMultiSelectOption;      // city item to populate the dropdown list
  public cityName;
  public taiexStrategic: number;
  public applicationFormUrl: string;
  public externalRequestId: string;
  public externalRequestUrl: string;

  // workflow related properties
  public createDate: Date;
  public submissionDate: Date;
  public holdingLetterDate: Date;       // Date of the acknowledge letter
  public consultationDate: Date;
  public consultationDeadline: string;
  public noConsultation: boolean;
  public taskSigned: boolean;
  public lastWorkflowStep: number;
  public nextWorkflowStep: number;
  public workflowComment: string;
  public commentStatus: number;        // 1 = workflow contains no comments, 2 = workflow contains comments
  public taskDecisionId: number;
  public approvalFormType: enApprovalFormType;
  public decisionDate: Date;
  public answerDate: Date;
  public answerDeadline: string;
  public status: number;
  public jwt: string;

  constructor() {
    this.expertise = new ChapterSelectedList();
    this.keywords = [];
    this.taskId = -1;
    this.requestId = -1;
    this.noConsultation = false;
    this.taskSigned = false;
    this.taskDecisionId = 0;   // undecided
    this.beneficiaryId = null;
    this.approvalFormType = enApprovalFormType.none;
    this.taiexStrategic = 0;
    this.eventIdList = [];
    this.allowedWorkflowActions = [];
  }

  get deadlineDateStr() {
    if (this.deadlineDate) {
      return '(' + this.deadlineDate + ')';
    }
    return '';
  }
}

export class TaskWorkflow {
  public static workflowStepToString(value: enTaskWorkflowStep): string {
    let result: string = '';
    switch (value) {
    case enTaskWorkflowStep.TA_I:
      result = 'Task Inserted';
      break;
    case enTaskWorkflowStep.TA_AL:
      result = 'Task Ack. letter sent';
      break;
    case enTaskWorkflowStep.TA_F:
      result = 'Task Finished';
      break;
    case enTaskWorkflowStep.TA_S:
      result = 'Task Signed';
      break;
    case enTaskWorkflowStep.TA_R:
      result = 'Task Refused';
      break;
    case enTaskWorkflowStep.TA_C:
      result = 'Task Completed';
      break;
    case enTaskWorkflowStep.TA_U:
      result = 'Task Unsigned';
      break;
    }

    return result;
  }

  public static workflowStepOkCaption(value: enTaskWorkflowStep): string {
    let captionOkBtn = 'Ok';
    switch (value) {
    case enTaskWorkflowStep.TA_S:
      captionOkBtn = 'Sign';
      break;
    case enTaskWorkflowStep.TA_R:
      captionOkBtn = 'Refuse';
      break;
    case enTaskWorkflowStep.TA_U:
      captionOkBtn = 'Unsign';
    }
    return captionOkBtn;
  }
}

export interface IEventType {
  id: number;
  name: string;
  eventCategoryId: number;
}

export class ConferenceFacilityOption {
  addTypeId: number;
  addTypeAbbreviation: string;
  addTypeDescription: string;
  confFacId: number;
  confFacDescription: string;
  displayOrder: number;

  constructor(data: {
    addTypeId: number,
    addTypeAbbreviation: string,
    addTypeDescription: string,
    confFacId: number,
    confFacDescription: string,
    displayOrder: number
  } = { addTypeId: -1, addTypeAbbreviation: '', addTypeDescription: '', confFacId: -1, confFacDescription: '', displayOrder: null }) {
    Object.assign(this, data);
  }

  get id(): number {
    return this.confFacId;
  }

  get name(): string {
    return this.confFacDescription;
  }
}

export class TaiexContractor implements IMultiSelectOption {
  id: number;
  name: string;
  startDate: moment.Moment;
  endDate: moment.Moment;

  constructor (data: {
    id: number,
    name: string,
    startDate: moment.Moment | string,
    endDate: moment.Moment | string,
  } = { id: undefined, name: '', startDate: null, endDate: null }) {
    Object.assign(this, data);
    this.startDate = (data.startDate !== undefined && data.startDate !== null) ? moment.utc(data.startDate) : undefined;
    this.endDate = (data.endDate !== undefined && data.endDate !== null) ? moment.utc(data.endDate) : undefined;
  }
}
