import { IMultiSelectOption } from '../multiselect/multiselect.component';

export class MultiSelectOption implements IMultiSelectOption {
  public id: number | string;
  public name: string;
  public disabled: boolean = false;
  /**
   * Internal field which should be only used by the multiselect component
   */
  public checked: boolean;

  constructor(id: number | string = -1, name: string = '', disabled: boolean = false) {
    this.id = id;
    this.name = name;
    this.disabled = disabled;
    this.checked = false; // internal field
  }
}
