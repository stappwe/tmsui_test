import * as _ from 'lodash';

export class HelperRoutines {
  public static shallowEqual(object1: any, object2: any): boolean {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }

    return _.difference(keys1, keys2).length === 0 && _.difference(keys2, keys1).length === 0;
  }
}
