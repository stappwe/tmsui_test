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

export enum enEventCategory {
  OTHER = 0,
  WORKSHOP = 1,
  STUDY_VISIT = 2,
  EXPERT_MISSION = 3,
  HOME = 4,
  PROCUREMENT = 5
}

/**
 * Form type - used by expert registration
 */
export enum enFormType {
  SpeakerExpert = 1,
  EUInstitution = 2,
  HostInstitution = 3,
  PrivateSpeakerExpert = 4
}

/**
 * Person type - used to make distinguish between participant and speakers/experts
 */
export enum enPersonType {
  none= 0,
  participant = 1,
  speaker = 2
}

/**
 * ncpValidation values
 */
export enum enNCPValidated {
  toBeValidated = 0,
  refused = 1,
  accepted = 2,
  automaticValidated = 4
}

export class CaseHandler {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: enUserRoleType;
  displayTooltip: string;

  constructor(data: {
    id: string,
    name: string,
    email: string,
    phone: string;
    type: enUserRoleType
  } = { id: '', name: '', email: '', phone: '', type: enUserRoleType.NONE }) {
    Object.assign(this, data);
    this.type = data.type as enUserRoleType;
    this.displayTooltip = (this.name ? this.name + ' \n ' : '') +
      (this.email ? this.email + ' \n ' : '') +
      (this.phone ? this.phone : '');
  }
}
