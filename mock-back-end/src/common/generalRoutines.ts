import * as fs from 'fs';
import * as nodeConfig from 'config';

export enum enAlert {
  success = 1,
  info = 2,
  warning = 3,
  danger = 4
}

export enum enTokenType {
  NONE = 0,
  REG = 1,           // registration token
  PAX = 2,           // Participant token
  SPEAKER = 3,       // Speaker token
  APPFORM = 4,       // Application form token
  APPFORMTMS = 5,    // Application form token - TMS Token
  EDB = 6,           // EDB token
  EVALUATION = 7,    // Evaluation form token
  INFORMNATCONT = 8, // Inform National Contact
  REPORTS = 9,       // Reports
  PARTPORT = 10      // ParticipantPortal
}

// enUserRole[0] -> 'NONE'
export enum enUserRole {
  NONE = 0,
  LCO = 1,
  NCP = 2,
  PAX = 4,
  SPEAKER = 8,
  EXPERT = 16,
  ICP = 32
}

export class JWT {
  public payLoad: any;
  public tokentype: enTokenType;
  public role: enUserRole;

  constructor(token: string) {
    const decoded = new Buffer(token.split('.')[1], 'base64').toString('ascii');
    this.payLoad = JSON.parse(decoded);
    this.tokentype = (this.payLoad.tokentype) ? this.payLoad.tokentype : enTokenType.NONE;
    this.role = (this.payLoad.role) ? this.payLoad.role : enUserRole.NONE;
  }
}

export class GeneralRoutines {
  static get appConfig() {
    if (!this._config) {
      this._config = {};
      // server configuration
      this._config.server = Object.assign({}, nodeConfig.get('server'));
    }

    return this._config;
  }

  public static fileExist(path: string): boolean {
    try {
      return fs.existsSync(path);
    } catch (err) {
      return false;
    }
  }

  private static _config: any;
}

export class RequestResult {
  result: boolean;            // true on success, failure on error - no insert,...
  message: string;            // corresponding message: success, warning, error...
  messageType: enAlert;       //   success = 1, info = 2, warning = 3, danger = 4
  data: any;                  // to be used for any optional information returned from backend

  constructor(result: boolean = false, message: string = '', messagetype: enAlert = enAlert.success, data: any = {}) {
    this.result = result;
    this.message = message;
    this.messageType = messagetype;
    this.data = data;
  }
}
