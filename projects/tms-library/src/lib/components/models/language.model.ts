import { IMultiSelectOption } from '../multiselect/multiselect.component';

export class Language implements IMultiSelectOption {
  id: number;
  description: string;
  abbreviation: string;
  visible: number;

  get fullDescription(): string {
    return this.name + ' (' + this.abbreviation + ')';
  }

  get name(): string {
    return this.description;
  }

  constructor(data: {
    id: number,
    description: string,
    abbreviation: string,
    visible: number
  } = { id: -1, description: '', abbreviation: '', visible: 1 }) {
    Object.assign(this, data);
  }
}
