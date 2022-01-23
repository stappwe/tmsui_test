import { KeywordList, Keyword } from './keyword.model';

import * as _ from 'lodash';

import { GeneralRoutines } from '../generalRoutines';

/**
 * Possible coverage level values for the underlying chapters
 */
export enum enCoverageLevel {
  full = 1,
  partial = 2
}

export class Chapter {
  id: number;
  description: string;
  parentid: number;
  ticked: boolean;
  chapterKeywordList: KeywordList;

  /**
   * Construct chapter object
   * @param [id=0] - chapter ID
   * @param [description=] - chapter description
   * @param [parentid=0] - chapter parent ID link
   * @param [ticked=false] - Identify if chapter is selected or not
   * @param [chapterkeywordlist=new KeywordList()] - list of available chapter for this keyword
   */
  constructor(id?: number, description?: string, parentid?: number, ticked?: boolean, chapterkeywordlist?: KeywordList) {
    this.id = id || 0;
    this.description = description || '';
    this.parentid = parentid || 0;
    this.ticked = ticked || false;
    this.chapterKeywordList = chapterkeywordlist || new KeywordList();
  }

  /**
   * Load the items from the JSON data
   * @param data - JSON data to be translated
   * @returns true = succeeded
   */
  public loadJSON(data: any): boolean {
    this.id = data['id'];
    this.description = data['description'];
    this.parentid = data['parentid'];
    this.ticked = data['ticked'];

    this.chapterKeywordList.loadJSON(data['chapterKeywords']);

    return true;
  }
}

export class ChapterList {
  public items: Array<Chapter>;

  /**
   * Construct chapter list
   * @param [items=[]] - list of chapters
   */
  constructor(items?: Array<Chapter>) {
    this.items = items || [];
  }

  /**
   * Load the items from the JSON data
   * @param data - JSON data to be translated
   * @returns true = succeeded
   */
  public loadJSON(data: any): boolean {
    let chapter: Chapter;
    // 1. clear the list
    this.items = [];
    // 2. load the data from the JSON
    if (data) {
      for ( let i = 0; i < data.length; i++) {
        chapter = new Chapter();
        chapter.loadJSON(data[i]);
        this.items.push(chapter);
      }
    }

    return true;
  }

  /**
   * Get the list of keywords for the all chapters
   * @returns List of unique keywords sort by description
   */
  public getAllKeywords(): Array<Keyword> {
    let keywords: Array<Keyword> = [];
    // 1. create keyword list
    keywords = [];
    // 2. get the list of all keywords
    for (let item of this.items) {
      keywords = _.unionBy(keywords, item.chapterKeywordList.items, 'id');
    }
    // 3. sort list of keyword
    keywords = _.sortBy(keywords, ['name']);

    return keywords;
  }

  /**
   * get the unique stored keyword list
   */
  public getKeywordsSelectedChapters(chapterSelected: Array<ChapterSelected>): Array<Keyword> {
    // 1. Initialise keyword list
    let keywords: Array<Keyword> = [];
    let fCheckItem: Chapter;
    // 2. get the list of all keywords
    for (let item of chapterSelected) {
      fCheckItem = _.find(this.items, ['id', item.id]);
      if (fCheckItem !== undefined) { // if found
        keywords = _.unionBy(keywords, fCheckItem.chapterKeywordList.items, 'id');
      }
    }
    // 3. sort list of keyword
    keywords = _.sortBy(keywords, ['name']);
    keywords = _.map(keywords, function (item) {
      return new Keyword(item.id, item.description);
    });

    return keywords;
  }
}

export class ChapterSelected {
  id: number;
  coverageLevel: enCoverageLevel;

  /**
   * Constructor
   * @param [id=0] - Selecter chapter ID
   * @param [coveragelevel=enCoverageLevel.full] - Coverage level
   */
  constructor(id?: number, coveragelevel?: enCoverageLevel) {
    this.id = id || 0;
    this.coverageLevel = coveragelevel || enCoverageLevel.full;
  }

  /**
   * Load the items from the JSON data
   * @param data - JSON data to be translated
   * @returns true = succeeded
   */
  public loadJSON(data: any): boolean {
    this.id = data['id'];
    this.coverageLevel = <enCoverageLevel>data['coverageLevel'];

    return true;
  }
}

export class ChapterSelectedList {
  private _items: Array<ChapterSelected>;

  /**
   * Constructor
   * @param [items=[]] - list of selected chapters to initialise
   */
  constructor(items?: Array<ChapterSelected>) {
    this._items = items || [];
  }

  /**
   * Load the selected items from the JSON to the tree selection
   * @param data - JSON data to be translated
   * @returns true = succeeded
   */
  public loadJSON(data): boolean {
    let chapterSelected: ChapterSelected;
    let selectedList: Array<ChapterSelected>;

    // 1. clear the list
    this._items = [];
    // 2. load the data from the JSON
    if (data) {
      for ( let i = 0; i < data.length; i++) {
        chapterSelected = new ChapterSelected();
        chapterSelected.loadJSON(data[i]);
        this._items.push(chapterSelected);
      }
    }

    return true;
  }

  /**
   * Save the _items
   * @returns return the _items
   */
  public getJSON(): Array<ChapterSelected> {
    return this._items;
  }

  /**
   * Extract the selected treeview items in compress format
   * @param chapterlist - Complete chapter list
   * @returns compress selected chapterlist
   */
  public getSelectedTreeItems(chapterlist: ChapterList): Array<Chapter> {
    let items: Array<Chapter> = [];
    let chapter: Chapter;

    for (let item of this._items) {
      chapter = _.find(chapterlist.items, ['id', item.id]);
      if (chapter !== undefined) {
        chapter.ticked = true; // to prevent dirty settings on form validation
        if (item.coverageLevel === enCoverageLevel.partial) {
          if (chapter !== undefined) {
            items.push(Object.assign({}, chapter));
          }
        } else { // enCoverageLevel.full -> include all children
          if (chapter !== undefined) {
            items.push(Object.assign({}, chapter));
          }
          this.addAllChildItems(items, chapterlist, item.id);
        }
      }
    }

    return items;
  }

  /**
   * Load compress chapter list
   * @param items - copmpress chapter list to be selected
   * @param chapterlist - full chapter list
   */
  public setSelectedTreeItems(items: Array<Chapter>, chapterlist: ChapterList): void {
    let fCheckItem: Chapter;
    let parentItem: any;
    // 1. reset existing items
    this._items = [];
    // Check checking if selection is emtpy
    if (!GeneralRoutines.isNullOrUndefined(items) && items !== []) {
      // 2. create checked list, list with items selected (clone, copy, reset and assign)
      let checkedList = _.cloneDeep(chapterlist.items);
      checkedList.forEach((item) => { item.ticked = false; });
      for (let item of items) {
        fCheckItem = _.find(checkedList, ['id', item.id]);
        if (fCheckItem !== undefined) { // If found, add to list
          fCheckItem.ticked = true;
        }
      }
      // 3. Add extra field with calculated value allChildChecked
      for (let item of _.filter(checkedList, ['ticked', true])) {
        item['allChildChecked'] = this.areAllChildSelected(checkedList, item.id);
      }
      // 4. Create new list
      for (let item of _.filter(checkedList, ['ticked', true])) {
        if (item['allChildChecked']) {
          // check if previous level was also allChildChecked. If so, no need to add anymore
          parentItem = _.find(checkedList, ['id', item.parentid]);
          if (parentItem === undefined || parentItem['allChildChecked'] === false) {
            this._items.push(new ChapterSelected(item.id, enCoverageLevel.full));
          }
        } else {
          this._items.push(new ChapterSelected(item.id, enCoverageLevel.partial));
        }
      }
    }
  }

  /**
   * Get the list of keywords for the selected chapters
   * @returns List of unique keywords sort by description
   */
  public getKeywordsSelectedTreeItems(chapterlist: ChapterList): Array<Keyword> {
    let keywords: Array<Keyword> = [];
    let chapter: Chapter;
    // 1. create keyword list
    keywords = [];
    // 2. get the list of all keywords
    for (let item of this._items) {
      chapter = _.find(chapterlist.items, ['id', item.id]);
      if (chapter !== undefined) { // if found
        keywords = _.unionBy(keywords, chapter.chapterKeywordList.items, 'id');
      }
    }
    // 3. sort list of keyword
    keywords = _.sortBy(keywords, ['name']);

    return keywords;
  }

  /**
   * Mark all child items as Selected
   * @param items - List of selected items
   * @param chapterlist - full chapter list
   * @param id - parent ID for which all child items should be selected
   */
  private addAllChildItems(items: Array<Chapter>, chapterlist: ChapterList, id: number): void {
    for (let childItem of _.filter(chapterlist.items, ['parentid', id])) {
      childItem.ticked = true; // to prevent dirty settings on form validation
      items.push(Object.assign({}, childItem));
      this.addAllChildItems(items, chapterlist, childItem.id);
    }
  }

  /**
   * Check of all child items are selected
   * @param items - list to be selected
   * @param id - parent ID  for which the items should be selected
   * @returns All child items selected: true or false
   */
  private areAllChildSelected(items: Array<Chapter>, id: number): boolean {
    let allChecked = true;
    // 1. check it items contains direct descent unchecked items, if return false
    if (_.filter(items, { 'parentid': id, 'ticked': false }).length > 0) {
      return false;
    }
    // 2. Check all descent items
    for (let childItem of _.filter(items, { 'parentid': id, 'ticked': true })) {
      allChecked = this.areAllChildSelected(items , childItem.id);
      if (allChecked === false) {
        return false;
      }
    }

    return allChecked;
  }
}
