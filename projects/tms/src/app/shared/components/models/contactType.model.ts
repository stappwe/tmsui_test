import { IMultiSelectOption } from 'tms-library';

export class ContactType implements IMultiSelectOption {
  id: number;
  name: string;
  abbreviation: string;
  applications: Array<number>;

  constructor(contactTypeID: number = -1, contactType: string = '', abbreviation: string = '', applications: Array<number> = []) {
    this.id = contactTypeID || -1;
    this.name = contactType || '';
    this.abbreviation = abbreviation || '';
    this.applications = applications;
  }
}
