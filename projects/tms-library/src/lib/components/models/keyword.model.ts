import { IMultiSelectOption } from '../multiselect/multiselect.component';

export interface ITranslation<T> {
  en: T;
  fr: T;
  es: T;
  pt: T;
}

export interface IMultiSelectTranslatedOption {
  id: number;
  description: ITranslation<string>;
  name: string;
  disabled?: boolean;
}

export interface IMultiSelectExtendOption {
  id: number;
  name: string | object;
  disabled?: boolean;
}

export class MultiSelectTranslatedOption implements IMultiSelectTranslatedOption {
  id: number;
  description: ITranslation<string>;
  disabled?: boolean;

  constructor(data: {
    id: number,
    description: string | ITranslation<string>,
    disabled?: boolean,
  } = { id: 0, description: '', disabled: false }) {
    Object.assign(this, data);
    this.description = (typeof data.description === 'object')
      ? data.description : { en: data.description, fr: data.description, es: data.description, pt: data.description };
  }

  get name(): string {
    return this.description['en'];
  }
}

export class Keyword implements IMultiSelectOption {
  id: number;
  description: ITranslation<string>;

  constructor(id: number = 0, description: string | ITranslation<string> = '') {
    this.id = id;
    this.description = (typeof description === 'object') ? description : { en: description, fr: description, es: description, pt: description };
  }

  public loadJSON(data: any): boolean {
    this.id = data['id'];
    this.description = (typeof data['description'] === 'object')
      ? data['description'] : { en: data['description'], fr: data['description'], es: data['description'], pt: data['description'] };

    return true;
  }

  get name(): string {
    return this.description['en'];
  }
}

export class KeywordList {
  items: Array<Keyword>;

  constructor(items?: Array<Keyword>) {
    this.items = items || [];
  }

  public loadJSON(data: any): boolean {
    let keyword: Keyword;
    // 1. clear the list
    this.items = [];
    // 2. load the data from the JSON
    for ( let i = 0; i < data.length; i++) {
      keyword = new Keyword();
      keyword.loadJSON(data[i]);
      this.items.push(keyword);
    }

    return true;
  }
}

// export class Keyword implements IMultiSelectOption {
//   id: number;
//   description: string;
//
//   constructor(id?: number, description?: string) {
//     this.id = id || 0;
//     this.description = description || '';
//   }
//
//   public loadJSON(data: any): boolean {
//     this.id = data['id'];
//     this.description = data['description'];
//
//     return true;
//   }
//
//   get name(): string {
//     return this.description;
//   }
//   set name(value: string) {
//     this.description = value;
//   }
// }
//
// export class KeywordList {
//   items: Array<Keyword>;
//
//   constructor(items?: Array<Keyword>) {
//     this.items = items || [];
//   }
//
//   public loadJSON(data: any): boolean {
//     let keyword: Keyword;
//     // 1. clear the list
//     this.items = [];
//     // 2. load the data from the JSON
//     for ( let i = 0; i < data.length; i++) {
//       keyword = new Keyword();
//       keyword.loadJSON(data[i]);
//       this.items.push(keyword);
//     }
//
//     return true;
//   }
// }
