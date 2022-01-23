interface Boolean {
  toInteger(): number;
}

if (typeof Boolean.prototype.toInteger !== 'function') {
  Boolean.prototype.toInteger = function () {
    return (this === true) ? 1 : 0;
  };
}

interface Date {
  withoutTime();
}

if (typeof Date.prototype.withoutTime !== 'function') {
  Date.prototype.withoutTime = function () {
    let dateWithoutTime = new Date(this);
    dateWithoutTime.setHours(0, 0, 0, 0);
    return dateWithoutTime;
  };
}

interface String {
  format(...arg: any[]): string;
  contains(str: string, ignoreCase?: boolean): boolean;
  startWith(str: String): boolean;
  endWith(str: string): boolean;
  leftstr(n: number): string;
  rightstr(n: number): string;
  remove(startIndex: number, count: number): string;
  rtrim(chr?: string): string;
  ltrim(chr?: string): string;
  replaceAll(find: string, replace: string): string;
  toField(chr?: string): string;
  toTooltip(chr?: string): string;
}

if (typeof String.prototype.format !== 'function') {
  // Extend string with format option like in c#, ex: 'Added {0} by {1} to your collection'.format(title, artist)
  String.prototype.format = function (...arg: any[]): string {
    let s: string = this,
      i: number = arg.length;

    while (i--) {
      s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arg[i]);
    }
    return s;
  };
}
if (typeof String.prototype.contains !== 'function') {
  String.prototype.contains = function (str: string, ignoreCase: boolean): boolean {
    str = (str) ? str : '';
    ignoreCase = (ignoreCase) ? ignoreCase : false;
    if (ignoreCase === false) {
      return this.indexOf(str) !== -1;
    } else { return this.toLowerCase().indexOf(str.toLowerCase()) !== -1; }
  };
}
if (typeof String.prototype.startWith !== 'function') {
  String.prototype.startWith = function (str: string): boolean {
    return ((str.length > 0) && (this.substring(0, str.length) === str));
  };
}
if (typeof String.prototype.endWith !== 'function') {
  String.prototype.endWith = function (str: string): boolean {
    return ((str.length > 0) && (this.substring(this.length - str.length) === str));
  };
}
if (typeof String.prototype.leftstr !== 'function') {
  String.prototype.leftstr = function (n: number): string {
    if (n <= 0) {
      return '';
    } else if (n > String(this).length) {
      return this;
    } else {
      return String(this).substring(0, n);
    }
  };
}
if (typeof String.prototype.rightstr !== 'function') {
  String.prototype.rightstr = function (n: number): string {
    if (n <= 0) {
      return '';
    } else if (n > String(this).length) {
      return this;
    } else {
      let iLen = String(this).length;
      return String(this).substring(iLen, iLen - n);
    }
  };
}
if (typeof String.prototype.remove !== 'function') {
  String.prototype.remove = function (startIndex: number, count: number): string {
    return this.substr(0, startIndex) + this.substr(startIndex + count);
  };
}
if (typeof String.prototype.rtrim !== 'function') {
  String.prototype.rtrim = function (chr?: string): string {
    let rgxtrim: RegExp = (!chr) ? new RegExp('\\s+$') : new RegExp(chr + '+$');
    return String(this).replace(rgxtrim, '');
  };
}
if (typeof String.prototype.ltrim !== 'function') {
  String.prototype.ltrim = function (chr?: string): string {
    let rgxtrim: RegExp = (!chr) ? new RegExp('^\\s+') : new RegExp('^' + chr + '+');
    return String(this).replace(rgxtrim, '');
  };
}
if (typeof String.prototype.replaceAll !== 'function') {
  String.prototype.replaceAll = function (find: string, replace: string): string {
    let str: string = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
  };
}
if (typeof String.prototype.toField !== 'function') {
  String.prototype.toField = function (chr?: string): string {
    chr = (chr) ? chr : '\\n';
    return this.replaceAll(chr, '');
  };
}
if (typeof String.prototype.toTooltip !== 'function') {
  String.prototype.toTooltip = function (chr?: string): string {
    chr = (chr) ? chr : '\\n,';
    return this.replaceAll(chr, String.fromCharCode(13));
  };
}

// array
interface Array<T> {
  clone(): Array<T>;
  remove(value: Object): number;
  insert(index: number, value: Object);
  Text(): string;
  getUnique(): Array<T>;
  getUniqueByProp(prop: string): any[];
  findFirstByProperty(propName: string, matchValue?: any, casesensitive?: boolean): T;
  maxValue(propName: string): number;
  minValue(propName: string): number;
  clear();
  inArray(comparer: Function): boolean;
  pushIfNotExist(element: any, comparer: Function): void;
  includes(searchElement: any, fromIndex?: number): boolean;
}

if (typeof Array.prototype.clone !== 'function') {
  Array.prototype.clone = function (): any[] {
    return this.slice(0);
  };
}
// Index is returned. When not found, -1 is returned.
if (typeof Array.prototype.remove !== 'function') {
  Array.prototype.remove = function (value): number {
    let idx: number = this.indexOf(value);
    if (idx !== -1) {
      this.splice(idx, 1);
    }
    return idx;
  };
}
// insert item in array at index, 0 based index
if (typeof Array.prototype.insert !== 'function') {
  Array.prototype.insert = function (index: number, value: Object): void {
    this.splice(index, 0, value);
  };
}
// all items merged as text into one string
if (typeof Array.prototype.Text !== 'function') {
  Array.prototype.Text = function (): string {
    return this.join('\n');
  };
}
if (typeof Array.prototype.getUnique !== 'function') {
  Array.prototype.getUnique = function (): any[] {
    let a: any[] = [];
    for (let i: number = 0, l = this.length; i < l; i++) {
      if (a.indexOf(this[i]) === -1) {
        a.push(this[i]);
      }
    }
    return a;
  };
}
if (typeof Array.prototype.getUniqueByProp !== 'function') {
  Array.prototype.getUniqueByProp = function (prop: string): any[] {
    let a: any[] = [];
    let fItem;

    for (let i: number = 0, l = this.length; i < l; i++) {
      fItem = this[i];
      if (a.indexOf(fItem[prop]) === -1) {
        a.push(fItem[prop]);
      }
    }
    return a;
  };
}
if (typeof Array.prototype.findFirstByProperty !== 'function') {
  Array.prototype.findFirstByProperty = function (propName: string, matchValue?: any, casesensitive?: boolean): any {
    casesensitive = (typeof casesensitive === 'undefined') ? false : casesensitive;
    // object values can never be case sensitive!!
    casesensitive = (typeof matchValue === 'object') ? true : casesensitive;
    matchValue = (typeof matchValue === 'undefined') ? '' : matchValue;
    matchValue = (casesensitive === true) ? matchValue : matchValue.toString().toUpperCase();

    let fItem: any;
    let fCurrentValue: any;
    let matchingItem: any = null;
    for (let i: number = 0; i < this.length; i++) {
      fItem = this[i];
      fCurrentValue = (typeof fItem[propName] === 'undefined') ? '' : fItem[propName];
      if (((fCurrentValue === matchValue) && (casesensitive === true)) ||
        ((fCurrentValue.toString().toUpperCase() === matchValue) && (casesensitive === false))) {
        matchingItem = fItem;
        break;
      }
    }
    return matchingItem;
  };
}
if (typeof Array.prototype.maxValue !== 'function') {
  Array.prototype.maxValue = function (propName: string): number {
    let allItems: any[] = this;
    let fMaxValue: number = Number.MAX_VALUE * (-1);
    for (let i: number = 0; i < allItems.length; i++) {
      let fCurrent: any = allItems[i];
      if (fCurrent[propName] > fMaxValue) { fMaxValue = fCurrent[propName]; }
    }
    fMaxValue = (fMaxValue === (Number.MAX_VALUE * (-1))) ? 0 : fMaxValue;
    return fMaxValue;
  };
}
if (typeof Array.prototype.minValue !== 'function') {
  Array.prototype.minValue = function (propName: string): number {
    let allItems: any[] = this;
    let fMinValue: number = Number.MAX_VALUE;
    for (let i: number = 0; i < allItems.length; i++) {
      let fCurrent: any = allItems[i];
      if (fCurrent[propName] < fMinValue) { fMinValue = fCurrent[propName]; }
    }
    fMinValue = (fMinValue === Number.MAX_VALUE) ? 0 : fMinValue;
    return fMinValue;
  };
}
if (typeof Array.prototype.clear !== 'function') {
  Array.prototype.clear = function (): void {
    this.splice(0, this.length);
  };
}
if (typeof Array.prototype.inArray !== 'function') {
  /**
   * check if an element exists in array using a comparer function
   * comparer : function(currentElement)
   * @param comparer
   * @returns {boolean}
   */
  Array.prototype.inArray = function(comparer: Function): boolean {
    for (let i: number = 0; i < this.length; i++) {
      if (comparer(this[i])) { return true; }
    }
    return false;
  };
}
if (typeof Array.prototype.pushIfNotExist !== 'function') {
  /**
   * adds an element to the array if it does not already exist using a comparer function
   * @param element
   * @param comparer
   */
  Array.prototype.pushIfNotExist = function(element: any, comparer: Function): void {
    if (!this.inArray(comparer)) {
      this.push(element);
    }
  };
}
// From https://github.com/kevlatus/polyfill-array-includes/blob/master/array-includes.js
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function (searchElement, fromIndex) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      let o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      let len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      let n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      let k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        // c. Increase k by 1.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}
