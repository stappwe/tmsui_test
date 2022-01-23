import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { DatePipe } from '@angular/common';

import 'moment-timezone';
import moment from 'moment';

export class KeyValue {
  public key: number;
  public value: string;

  constructor(key?: number, value?: string) {
    this.key = key || undefined;
    this.value = value || '';
  }
}

// Custom date format settings
export const TMS_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  }
};
export const TMS_DATETIME_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY HH:mm',
  },
  display: {
    dateInput: 'DD/MM/YYYY HH:mm',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY HH:mm',
    monthYearA11yLabel: 'MM YYYY',
  }
};

export interface IFormError {
  control: string;
  error: string;
  value: any;
}

export class GeneralRoutines {
  // source of expression: http://emailregex.com/  , W3C standaard
  // tester: https://www.regextester.com/
  // tslint:disable-next-line:max-line-length
  public static EMAIL_REGEXP = /^(([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)*)|(".+"))[^.]@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  /**
   * Count bytes in a string's UTF-8 representation.
   * @param text
   */
  public static getByteLen(text: string): number {
    let _charCode: number;
    let _byteLen: number = 0;
    if (text?.length) {
      for (let i: number = 0; i < text.length; i++) {
        _charCode = text.charCodeAt(i);
        _byteLen += _charCode < (1 << 7) ? 1 :
          _charCode < (1 << 11) ? 2 :
            _charCode < (1 << 16) ? 3 :
              _charCode < (1 << 21) ? 4 :
                _charCode < (1 << 26) ? 5 :
                  _charCode < (1 << 31) ? 6 : Number.NaN;
      }
    }

    return _byteLen;
  }

  public static dateValidator(control: FormControl): { [s: string]: boolean } {
    console.log('data:' + control.value.toString());
    if (!control.value || !moment.isDate(control.value)) {
      return { invalidItem : true };
    }
  }

  public static minMaxDateValidator(minDateValue: moment.Moment, maxDateValue: moment.Moment) {
    return function minMaxDateValidate(control: FormControl) {
      let controlValue = control.value ? (moment.isMoment(control.value) ? control.value : moment.utc(control.value)) : undefined;
      if (!controlValue) {
        return { invalidDate : true };
      } else {
        let dateValue = moment.utc(control.value);
        if (dateValue.isSameOrAfter(minDateValue) === false) {
          return { invalidMinDate : true };
        } else if (dateValue.isSameOrBefore(maxDateValue) === false) {
          return { invalidMaxDate : true };
        }
      }

      return null;
    };
  }

  public static emptyIDValidator(control: FormControl): { [s: string]: boolean } {
    if (GeneralRoutines.isNullOrUndefined(control.value) || control.value === -1) {
      return { invalidItem : true };
    }
  }

  public static emailValidator(control: FormControl): { [s: string]: boolean } {
    if (control.value && GeneralRoutines.EMAIL_REGEXP.test(control.value) === false) {
      return { invalidEmail: true };
    }
  }

  /**
   * validator for maximum 2 email addreses
   * @param control
   */
  public static twoEmailValidator(control: FormControl): { [s: string]: boolean } {
    // source of expression: http://emailregex.com/  , W3C standaard but with ;, and optional space as
    // tslint:disable-next-line
    let EMAIL_REGEXP = /^(([a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+(\.[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+)*)|(".+"))[^.]@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))(([,;][ ]?)(([a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+(\.[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+)*)|(".+"))[^.]@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))?$/;

    // tslint:disable-next-line
    if (EMAIL_REGEXP.test(control.value) === false && control.value !== '') {
      return { invalidEmail: true };
    }
  }

  /**
   * validator for maximum 4 email addreses
   * @param control
   */
  public static fourEmailValidator(control: FormControl): { [s: string]: boolean } {
    // source of expression: http://emailregex.com/  , W3C standaard but with ;, and optional space as
    // [,;][ ]?
    // tslint:disable-next-line:max-line-length
    let EMAIL_REGEXP = /^(([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)*)|(".+"))[^.]@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))((([,;][ ]?)(([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)*)|(".+"))[^.]@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))?)((([,;][ ]?)(([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)*)|(".+"))[^.]@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))?)((([,;][ ]?)(([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+)*)|(".+"))[^.]@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))?)$/;

    if (EMAIL_REGEXP.test(control.value) === false && control.value !== '') {
      return { invalidEmail: true };
    }
  }

  public static urlValidator(control: FormControl): { [s: string]: boolean } {
    let URL_REGEXP = /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;

    if (control.value && URL_REGEXP.test(control.value) === false) {
      return { invalidURL: true };
    }
  }

  public static mayNotMatchValidator(compareControlName1: FormControl, compareControlName2: FormControl) {
    let thisControl: FormControl;
    let otherControl: FormControl;

    return function mayNotMatchValidate (control: FormControl) {
      if (!control.parent) {
        return null;
      }

      // Initializing the validator.
      thisControl = compareControlName1;
      if (!thisControl) {
        throw new Error('mayNotMatchValidate(): compareControlName1 control is not found in parent group');
      }
      otherControl = compareControlName2;
      if (!otherControl) {
        throw new Error('mayNotMatchValidate(): compareControlName2 control is not found in parent group');
      }

      if (otherControl.value && thisControl.value && (otherControl.value.trim().toLowerCase() === thisControl.value.trim().toLowerCase())) {
        return {
          mayNotMatch: true
        };
      }

      return null;
    };
  }

  public static oneOfTwoRequiredValidator(compareControlName1: string, compareControlName2: string) {
    let thisControl: FormControl;
    let otherControl: FormControl;

    return function mayNotMatchValidate (control: FormControl) {
      if (!control.parent) {
        return null;
      }

      // Initializing the validator.
      thisControl = control.get(compareControlName1) as FormControl;
      if (!thisControl) {
        throw new Error('mayNotMatchValidate(): compareControlName1 control is not found in parent group');
      }
      otherControl = control.get(compareControlName2) as FormControl;
      if (!otherControl) {
        throw new Error('mayNotMatchValidate(): compareControlName2 control is not found in parent group');
      }

      if ((!otherControl.value || otherControl.value === '') && (!thisControl.value || thisControl.value === '')) {
        return {
          oneOfTwoRequired: true
        };
      }

      return null;
    };
  }

  public static validFileSize(fileControl: any, limit: number) {
    let file = fileControl;
    return function minMaxValidate (control: FormControl) {
      if (file
        && file.length > limit) {
        return { fileSize: true };
      }
    };
  }

  public static validFileType(fileControl: any, exts: string) {
    return function validate (control: FormControl) {
      if (control && control.value) {
        let fileAr = /(?:\.([^.]+))?$/.exec(control.value);
        if (fileAr && fileAr.length > 1) {
          let valid = false;
          exts.toLowerCase().split(',').forEach(elem => {
            // tslint:disable-next-line:triple-equals
            if (elem === '.' + fileAr[1].toLowerCase()) {
              valid = true;
            }
          });
          if (!valid) {
            return { fileType: true };
          }
        }
      }
    };
  }

  /**
   * Validate the twinning number
   * @param countryAbbrList - List of country abbreviations allowed in the twinning project
   */
  public static twinningIDValidator(countryAbbrList: string[]) {
    return function twinningIDValidate(control: FormControl) {
      let TWINNINGID_REGEXP = new RegExp('^(' + countryAbbrList.join('|') +
        ') [0-9]{2} (IPA|ENI|ENPI|EDF|DCI|NDICI) (AG|FI|EY|EN|HE|JH|NS|SO|OT|EC|ST|SPP|TE|TR) [0-9]{2} [0-9]{2}( TWL)?( R[2-9]?)?(\([1-9]\))?$');

      if (TWINNINGID_REGEXP.test(control.value) === false && control.value !== '') {
        return { invalidFormat: true };
      }
    };
  }

  public static minMaxValidator(minvalue: number, maxvalue: number, optional?: boolean) {
    optional = (optional) ? optional : false;
    return function minMaxValidate (control: FormControl) {
      if (control.value && Number.isInteger(control.value) && control.value >= minvalue && control.value <= maxvalue) {
        return null;
      } else {
        if ((control.value === '' || !control.value) && optional === true) {
          return null;
        } else {
          return {
            mayNotMatch: true
          };
        }
      }
    };
  }

  public static compareValidator(from: string, to: string, equal?: boolean) {
    equal = (equal !== undefined) ? equal : true;
    return function compareValidate (control: FormGroup) {
      let fromValue = control.controls[from].value;
      let toValue = control.controls[to].value;
      if (fromValue && toValue && ((fromValue === toValue && equal === true) || (fromValue !== toValue && equal === false))) {
        return null;
      } else {
        return {
          compareNotMatch: true
        };
      }
    };
  }

  /**
   * Year validation: Check on 4 digits and value should be between 1950 and 2100
   * @param control
   */
  public static YearValidator(control: FormControl): { [s: string]: boolean } {
    let TWINNINGID_REGEXP = /^\d{4}$/;

    if (TWINNINGID_REGEXP.test(control.value) === false &&
        control.value !== '' && (Number(control.value) < 1950 || Number(control.value) > 2100)) {
      return { invalidFormat: true };
    }
  }

  /**
   * Check if extension for filename exist in the list of extensions
   * ex: hasExtension('upload.png', ['.jpg', '.gif', '.png')
   * @param filename - filename from which extension needs to be checked
   * @param exts - list of file extensions allowed, ex: '.jpg', '.gif', '.png'
   */
  public static hasExtension(filename: string, exts: Array<string>): boolean {
    return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(filename);
  }

  public static fileValidator(control: FormControl, extensions: Array<string>): { [s: string]: boolean } {
    if (control.value === undefined || control.value === '' || !this.hasExtension(control.value.toUpperCase(), extensions)) {
      return { invalidFile : true };
    }
  }

  public static maxByteSizeValidator(maxbytes: number): any {
    const result = function maxByteSizeValidate(c: FormControl) {
      let _usedBytes: number = 0;
      let err: any = {};
      if (c && c.value) {
        _usedBytes = GeneralRoutines.getByteLen(c.value);
        err = {
          invalidMaxByteSize: {
            given: _usedBytes,
            maxLength: maxbytes
          }
        };
      }
      return (_usedBytes > maxbytes) ? err : null;
    };

    return result;
  }

  public static passwordCharacterTypesValidator(control: FormControl): any {
    let EMAIL_REGEXP = /(?=^.{6,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/;

    if (control && control.value && control.value.length >= 8 && EMAIL_REGEXP.test(control.value) === false) {
      return { invalidCharTypes: true };
    }
    return null;
  }

  public static rangeDatePickerValidator(from: string, to: string) {
    const result = function rangeDatePickerValidate (control: FormGroup) {
      let fromDate = control.controls[from].value;
      let toDate = control.controls[to].value;
      if (fromDate && toDate && fromDate <= toDate) {
        return null;
      } else {
        return {
          invalidDateRange: true
        };
      }
    };

    return result;
  }

  public static noPastDatetimeValidator() {
    const result = function noPastDatetimeVValidate (control: FormControl) {
      let fromDate = control.value;
      if (control.value) {
        let thisMorning = new Date(Date.now()).withoutTime();
        // Extract contral value based on the type: Moment or Date
        let dateValue = (control.value instanceof moment) ? control.value.valueOf() : control.value;
        if ((dateValue - thisMorning) >= 0) {
          return null;
        } else {
          return {
            PastDatetimeRange: true
          };
        }
      }
    };

    return result;
  }

  /**
   * Construct an empty mail with the to containing the "to" parameter
   * @param toemail - ";" separated list of email addresses
   * @param subject - mail subject
   * @param body - body text of the mail - max 1024
   * @param ccemail - ";" separated list of email addresses
   * @param bccemail - ";" separated list of email addresses
   */
  public static sendMail(toemail: string, subject?: string, body?: string, ccemail?: string, bccemail?: string): void {
    if (toemail !== '') {
      let url = 'mailto:' + toemail + '?';
      url = url + ((ccemail) ? 'cc=' + ccemail + '&' : '');
      url = url + ((bccemail) ? 'bcc=' + bccemail + '&' : '');
      url = url + ((subject) ? 'subject=' + subject + '&' : '');
      url = url + ((body) ? 'body=' + body.leftstr(1024) + '&' : '');
      window.open(url, '_parent');
    }
  }

  /************************************/
  // Common functions
  public static openURL(url: string, target?: string): void {
    target = (target) ? target : '_parent';
    window.open(url, target);
  }

  public static toHtml(value: string): string {
    if (!GeneralRoutines.isNullOrUndefined(value)) {
      return value.replace(/\n/g, '<br/>');
    } else {
      return '';
    }
  }

  public static isNullOrUndefined(val: any): boolean {
    return typeof val === 'undefined' || val == null;
  }

  public static hasValue(val: string): boolean {
    return !GeneralRoutines.isNullOrUndefined(val) && val !== '';
  }

  public static isNumber(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  public static dateToDatePicker(value: Date): any {
    if (value) {
      // getmonth -> 0 - 11!!
      return { date: { year: value.getFullYear(), month: value.getMonth() + 1, day: value.getDate() } };
    }

    return '';
  }

  public static datepickerToDate(value: any): Date {
    if (value && value.date) {
      let newValue: Date = new Date();
      newValue.setUTCFullYear(value.date.year, value.date.month - 1, value.date.day);
      return newValue;
    } else {
      return null;
    }
  }

  /**
   * Convert string to date
   * @param input - format dd/mm/yyyy
   */
  public static parseDate(value: string): Date {
    try {
      if (value) {
        let parts = value.split('/');
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      }
    } catch (e) {
      console.log('value \'' + value + '\' is not a valid date in the format dd/mm/yyyy! ');
      return undefined;
    }
  }

  public static getCompleteOffsetTop(element: any): number {
    let totalOffsetTop = 0;
    while (element) {
      totalOffsetTop += element.offsetTop;
      element = element.offsetParent;
    }
    return totalOffsetTop;
  }

  /**
   * valueFormatter - Convert the boolean value Y or N into Y or blank
   * @param params - Object containing the value to convert
   */
  public static convertToOnlyYes(params: any): any {
    return (params.value === 'Y') ? 'Y' : '';
  }

  /**
   * ValueFormatter - Convert the boolean value to Yes or No
   * @param params - object containing the value to convert
   */
  public static convertBooleanToYesNo(params: any): any {
    return (params.value === true) ? 'Yes' : 'No';
  }

  /**
   * ValueFormatter - Convert the boolean value to Yes or No
   * @param params - object containing the value to convert
   */
  public static convertYesNoToOnlyYes(params: any): any {
    return (params.value === 'Yes') ? 'Yes' : '';
  }

  public static arrayLengthValidator(control: FormControl): { [s: string]: boolean } {
    if (!control.value || control.value.length > 1) {
      return { invalidArrayLength : true };
    }
  }

  /**
   * Generate a unique key
   */
  public static generateUUID(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  /**
   * valueFormatter - Convert javascript date into Formatted date
   * @param params - number or Object containing the date
   * @param format - date format to be used during converting
   */
  public static convertToDate(params: any, format: string = 'DD/MM/YYYY'): any {
    // params: number or object
    if (GeneralRoutines.isNullOrUndefined(params)) {
      return '';
    } else if (typeof params === 'object') {
      return (params.value && params.value > 0) ? moment(new Date(params.value)).format(format) : '';
    } else if (typeof params === 'number') {
      return (params > 0) ? moment(new Date(params)).format(format) : '';
    } else {
      return 'Error';
    }
  }

  public static UTCDateAsString(value: moment.Moment, format: string = 'DD/MM/YYYY HH:mm'): string {
    return GeneralRoutines.isNullOrUndefined(value) ? '' : value.format(format);
  }

  public static valueRangeValidator(from: string, to: string) {
    const result = function compareValidate (control: FormGroup) {
      const fromValue = GeneralRoutines.isNumber(control.controls[from].value) ? parseFloat(control.controls[from].value) : undefined;
      const toValue = GeneralRoutines.isNumber(control.controls[to].value) ? parseFloat(control.controls[to].value) : undefined;
      if (fromValue !== undefined && toValue !== undefined && fromValue < toValue) {
        return null;
      } else {
        return {
          valueRangeError: true
        };
      }
    };

    return result;
  }

  /**
   * Get the number of days between the start and end date
   * @param start
   * @param end
   */
  public static getDayDiff(start: Date, end: Date): number {
    let timeDiff = Math.abs(start.getTime() - end.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  public static solveAresLink(displayText: string , aresLink: string) {
    let comment = displayText.toString();
    let finalComment = '';
    let aresCode = '';
    let idx_end = 0;
    let idx_start = comment.search(/ares:/i);
    while (idx_start >= 0) {
      idx_end = comment.indexOf(' ', idx_start + 6);
      if (idx_end > 0) {
        aresCode = comment.substring(idx_start, idx_end);
      } else {
        idx_end = idx_start + 11;
        aresCode = comment.substring(idx_start, idx_end);
      }
      // idx_end = idx_start + 11;
      // aresCode = comment.substring(idx_start, idx_end);
      console.log('arrescode: ' + aresCode);
      let aresno = aresCode.split(':')[1];
      finalComment += comment.substring(0, idx_start) + ' ' + '<a href=' + aresLink + aresno + ' target="_blank" title="ARES reference">' + aresno + '</a> ';
      comment = comment.substring(idx_end);
      idx_start = comment.search(/ares:/i);
    }
    finalComment += comment;

    return finalComment;
  }

  /**
   * To validate Date
   * @param control
   */
  public static isValidDate(control: FormControl): { [s: string]: boolean } {
    let DATE_REGEXP = new RegExp('^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\\d\\d$');
    if (control.value && DATE_REGEXP.test(control.value.formatted) === false) {
      return { invalidDate: true };
    }
  }

  /**
   * This regex allow 0 or greater number, doesn't allow negative number
   * @param control
   */
  public static noNegativeNumber(control: FormControl): { [s: string]: boolean } {
    let NUMBER_REGEXP = new RegExp('^[0-9]*$');

    if (control.value && NUMBER_REGEXP.test(control.value) === false) {
      return { invalidNumber: true };
    }
  }

  public static min6DigitValidator(control: FormControl): { [s: string]: boolean } {
    let REGEXP = /^\d{6}$/;
    if ( control.value != null && (control.value !== '' && REGEXP.test(control.value) === false)) {
      return { lessThanMinDigit: true };
    }
  }

  public static compareTwoDates(compareControlName: string) {
    let thisControl: FormControl;
    let otherControl: FormControl;

    return function mayNotMatchValidate(control: FormControl) {
      if (!control.parent) {
        return null;
      }

      // Initializing the validator.
      if (!thisControl) {
        thisControl = control;
        otherControl = control.parent.get(compareControlName) as FormControl;
        if (!otherControl) {
          throw new Error('compareTwoNumbers(): other control is not found in parent group');
        }
        otherControl.valueChanges.subscribe(() => {
          thisControl.updateValueAndValidity();
        });
      }

      if (!otherControl) {
        return null;
      }

      if (thisControl.value < otherControl.value) {
        return { endDateLessThanStart : true };
      }
      return null;
    };
  }

  public static limitToTwoDecimal(control: FormControl): { [s: string]: boolean } {
    let NUMBER_REGEXP = /^\d+(\.\d{1,2})?$/;

    if (control.value && NUMBER_REGEXP.test(control.value) === false) {
      return { invalidNumber: true };
    }
  }

  public static limitToDecimal(maxDigits: number) {
    const result = function limitToDecimalValidate(control: FormControl) {
      let NUMBER_REGEXP = new RegExp('^\\d+(\\.\\d{1,' + maxDigits + '})?$');

      if (control.value && NUMBER_REGEXP.test(control.value) === false) {
        return { invalidNumber: true };
      }
    };

    return result;
  }

  public static compareTwoNumbers(compareControlName: string) {
    let thisControl: FormControl;
    let otherControl: FormControl;

    return function mayNotMatchValidate(control: FormControl) {
      if (!control.parent) {
        return null;
      }

      // Initializing the validator.
      if (!thisControl) {
        thisControl = control;
        otherControl = control.parent.get(compareControlName) as FormControl;
        if (!otherControl) {
          throw new Error('compareTwoNumbers(): other control is not found in parent group');
        }
        otherControl.valueChanges.subscribe(() => {
          thisControl.updateValueAndValidity();
        });
      }

      if (!otherControl) {
        return null;
      }

      if (parseFloat(otherControl.value) < parseFloat(thisControl.value)) {
        return {
          notLessThan: true
        };
      }
      return null;
    };
  }

  public static sumCompareValidator(from: string, value1: string, value2: string, value3: string, value4: string, equal?: boolean) {
    equal = (equal !== undefined) ? equal : true;
    return function compareValidate (control: FormGroup) {
      let fromValue = control.controls[from].value;
      let toValue = parseFloat(control.controls[value1].value) + parseFloat(control.controls[value2].value) +
        parseFloat(control.controls[value3].value) + parseFloat(control.controls[value4].value);
      if (fromValue !== undefined && toValue !== undefined &&
        ((fromValue >= toValue && equal === true) || (fromValue >= toValue && equal === false))) {
        return null;
      } else {
        return {
          compareNotMatch: true
        };
      }
    };
  }

  public static diffCompareValidator(from: string, minuend: string, subtrahend: string, equal?: boolean) {
    equal = (equal !== undefined) ? equal : true;
    return function compareValidate (control: FormGroup) {
      let fromValue = control.controls[from].value;
      let toValue = parseFloat(control.controls[minuend].value) - parseFloat(control.controls[subtrahend].value);
      if (fromValue !== undefined && toValue !== undefined && ((fromValue <= toValue && equal === true) || (fromValue <= toValue && equal === false))) {
        return null;
      } else {
        return {
          compareNotMatch: true
        };
      }
    };
  }

  /**
   * Convert relative path to absolute path
   * @param relativePath - path should not have a leading /
   */
  public static getAbsolutePath(relativePath?: string): string {
    let absoluteUrl = window.location.protocol + '//' + window.location.host + '/';
    if (relativePath && (relativePath.startsWith('http://') || relativePath.startsWith('https://'))) {
      absoluteUrl = relativePath;
    } else if (relativePath) {
      absoluteUrl = absoluteUrl + relativePath;
    }
    return absoluteUrl;
  }

  public static formatDate(date: Date): string {
    if (date !== undefined && date !== null) {
      return new DatePipe('en-US').transform(date, 'dd/MM/yyyy').replaceAll('/', '_');
    } else {
      return null;
    }
  }

  /**
   * valueFormatter - Convert value into Currency format
   * @param params - Object containing the value to format
   * @returns - Formatted currency value
   */
  public static convertToCurrency(params: any): any {
    // , { style: 'currency', currency: 'EUR' }
    return (params.value !== undefined && params.value !== 0.0 && params.value !== null) ?
      params.value.toLocaleString('en-GB', { minimumFractionDigits: 2 }) : '';
  }

  /**
   * valueFormatter - Convert value into Currency format with Euro sign
   * @param params - Object containing the value to format
   */
  public static convertToEurCurrency(params: any): any {
    return (!GeneralRoutines.isNullOrUndefined(params.value) && params.value !== 0.0)
      ? params.value.toLocaleString('en-GB', { style: 'currency', currency: 'EUR' }) : '';  // fr-BE
  }

  /**
   * valueFormatter - Convert value into number format
   * @param params - Object containing the value to format
   */
  public static convertToNumber(params: any): any {
    return (!GeneralRoutines.isNullOrUndefined(params.value) && params.value !== 0.0)
      ? params.value.toLocaleString('en-GB', { minimumFractionDigits: 2 }) : '';
  }

  public static convertEUIDateToDate(value: object): Date {
    return moment.isMoment(value) ? value.toDate() : value as Date;
  }

  public static getBrowserName(): string {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
    case agent.indexOf('edge') > -1:
      return 'edge';
    case agent.indexOf('opr') > -1 && !!(<any>window).opr:
      return 'opera';
    case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
      return 'chrome';
    case agent.indexOf('trident') > -1:
      return 'ie';
    case agent.indexOf('firefox') > -1:
      return 'firefox';
    case agent.indexOf('safari') > -1:
      return 'safari';
    default:
      return 'other';
    }
  }

  // https://base64.guru/converter/encode/pdf - to get base64
  /**
   * Convert base64 to file
   * @param base64Data - base64 string to conver
   * @param filename - filename to be used for saving
   */
  public static saveBase64ToPDF(base64Data: string, filename: string): void {
    const browserType = GeneralRoutines.getBrowserName();
    if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE workaround
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else if (browserType === 'chrome' || browserType === 'edge') { // much easier if not IE
      const linkSource = 'data:application/pdf;base64, ' + base64Data;
      const downloadLink = document.createElement('a');

      downloadLink.href = linkSource;
      downloadLink.download = filename;
      downloadLink.click();
    } else {
      const linkSource = 'data:application/pdf;base64, ' + base64Data;
      window.open(linkSource, '_blank');
    }
  }

  /**
   * Convert base64 to file
   * @param base64Data - base64 string to conver
   * @param filename - filename to be used for saving
   */
  public static saveBase64ToDocx(base64Data: string, filename: string): void {
    const browserType = GeneralRoutines.getBrowserName();
    if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE workaround
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray],
        { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      window.navigator.msSaveOrOpenBlob(blob, filename);
    } else if (browserType === 'chrome' || browserType === 'edge' || browserType === 'firefox') { // much easier if not IE
      const linkSource = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64, ' + base64Data;
      const downloadLink = document.createElement('a');

      downloadLink.href = linkSource;
      downloadLink.download = filename;
      downloadLink.click();
    } else {
      const linkSource = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64, ' + base64Data;
      window.open(linkSource, '_blank');
    }
  }

  public static markAllFieldsAsDirty(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl && control.enabled) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.markAllFieldsAsDirty(control);
      }
    });
  }

  public static getFormValidationErrors(form: FormGroup) {
    const result = [];
    Object.keys(form.controls).forEach(key => {
      const formProperty = form.get(key);
      if (formProperty instanceof FormGroup) {
        result.push(...GeneralRoutines.getFormValidationErrors(formProperty));
      }
      const controlErrors: ValidationErrors = formProperty.errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          result.push({
            'control': key,
            'error': keyError,
            'value': controlErrors[keyError]
          });
        });
      }
    });

    return result;
  }

  /**
   * Convert size in bytes in a display text
   * @param size - in bytes
   */
  public static displayFileSize(size: number): string {
    if ((size / 1024 / 1024) > 1) {
      return (size / 1024 / 1024).toFixed(0) + ' MB';
    } else if ((size / 1024) > 1) {
      return (size / 1024).toFixed(0) + ' KB';
    } else {
      return (size).toFixed(0) + ' B';
    }
  }

  public static displayLocalRemoteTimezone(dateTime: moment.Moment): string {
    if (!GeneralRoutines.isNullOrUndefined(dateTime)) {
      const brusselsTimezone = dateTime.tz('Europe/Brussels').format('DD/MM/yyyy HH:mm z');
      const localTimezone = dateTime.tz(moment.tz.guess()).format('DD/MM/yyyy HH:mm z');
      if (brusselsTimezone === localTimezone) {
        return brusselsTimezone;
      } else {
        return brusselsTimezone + ' / ' + localTimezone;
      }
    } else {
      return '';
    }
  }

  public static displayInBrusselsTimezone(dateTime: moment.Moment): string {
    if (!GeneralRoutines.isNullOrUndefined(dateTime)) {
      return dateTime.tz('Europe/Brussels').format('DD/MM/yyyy HH:mm');
    } else {
      return '';
    }
  }

  public static displaFormattedDateInBrusselsTimezone(dateTime: moment.Moment, format: string): string {
    if (!GeneralRoutines.isNullOrUndefined(dateTime)) {
      return dateTime.tz('Europe/Brussels').format(format);
    } else {
      return '';
    }
  }
}
