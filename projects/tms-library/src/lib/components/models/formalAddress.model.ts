import { IMultiSelectOption } from '../multiselect/multiselect.component';

export class FormalAddress implements IMultiSelectOption {
  id: number;
  name: string;

  constructor(id?: number, name?: string) {
    this.id = id || -1;
    this.name = name || '';
  }
}
