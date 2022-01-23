import { IMultiSelectOption } from 'tms-library';

export class LineDG implements IMultiSelectOption {
  id: number;
  name: string;
  abbreviation: string;

  constructor(id?: number, name?: string, abbreviation?: string) {
    this.id = id || -1;
    this.name = name || '';
    this.abbreviation = abbreviation || '';
  }
}
