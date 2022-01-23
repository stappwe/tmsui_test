import { IMultiSelectOption } from 'tms-library';

export class CountryGroup implements IMultiSelectOption {
  id: number;
  name: string;
  abbreviation: string;

  constructor(groupID?: number, groupName?: string, abbreviation?: string) {
    this.id = groupID || -1;
    this.name = groupName || '';
    this.abbreviation = abbreviation || '';
  }
}
