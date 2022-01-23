import { IMultiSelectOption } from '../multiselect/multiselect.component';

export class Country implements IMultiSelectOption {
  id: number;
  name: string;
  abbreviation: string;

  constructor(countryId?: number, countryName?: string, abbreviation?: string) {
    this.id = countryId || -1;
    this.name = countryName || '';
    this.abbreviation = abbreviation || '';
  }
}
