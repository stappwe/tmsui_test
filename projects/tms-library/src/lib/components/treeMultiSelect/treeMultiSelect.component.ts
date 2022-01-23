import { Component, Input, Output, Pipe, EventEmitter, forwardRef, ElementRef, PipeTransform, ViewChildren,
         QueryList, OnInit, OnChanges, SimpleChanges, HostListener, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, FormControl, AbstractControl,
  ValidatorFn, Validators } from '@angular/forms';
import { MediaObserver } from '@angular/flex-layout';

import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import * as _ from 'lodash';

// ControlValueAccessor implementation
const noop = () => {
};

export function treeMultiSelectValidator(required?: boolean, maxselectrootlevelitems?: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    let _RequiredCheck: boolean = true;
    let _RoutLevelCheck: boolean = true;
    let err: any;
    required = (required !== undefined) ? required : false;
    maxselectrootlevelitems = (maxselectrootlevelitems !== undefined) ? maxselectrootlevelitems : 0;
    if (control.value !== null) {
      _RequiredCheck = ((control.value.length > 0 && required) || (required === false));
      if (maxselectrootlevelitems > 0 && control.value.length > 0) {
        _RoutLevelCheck = control.value.filter((item: any) => {
          return item.parentid === 0; }).length <= maxselectrootlevelitems;
      }

      err = {
        invalidTreeList: {
          requiredCheck: _RequiredCheck,
          routLevelCheck: _RoutLevelCheck,
          maxSelectRootLevelItems: maxselectrootlevelitems
        }
      };
    }
    let _Valid: boolean = (_RequiredCheck && _RoutLevelCheck);
    return (_Valid) ? null : err;
  };
}

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TreeMultiSelectComponent),
  multi: true
};

const CUSTOM_INPUT_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => TreeMultiSelectComponent),
  multi: true
};

export enum enSelectionMode {
  single = 0,
  multiple = 1
}

export interface ITreeMultiSelectSettings {
  buttonClasses?: string;                // additional text class to add to the button text
  isDisabled?: boolean;
  maxHeight?: string;
  includeTree?: boolean;                // Include tree in selection
  selectionMode?: enSelectionMode;
  maxLabels?: number;                   // maximum number of labels that will be displayed, 0 = no limitations
  buttonItemMaxLen?: number;            // Maximum length of the Item displayed in the text area, 0 = no Limitation
  enableRootLevelSelection?: boolean;   // Enable root level selection, except if root has no children
  maxNumberOfMainChapter?: number;        // Maximum number of main chapters that can be selected, 0 = no limitation
  minSearchLength?: number;             // Minimum searchField length needed before start searching, default = 2, min 1
  searchGroup?: boolean;                // Include group object in searchField and selection
  commitOnClose?: boolean;               // Commit the changes only on close of the component. Default but can be changed
  property?: {
    item?: string;                      // Item property of the object containing the display text, required
    key?: string;                       // Key property used to retrieve elements, needs to be unique and is required, required
    button?: string;                    // Label to display on the component in case of no selection, required
    tick?: string;                      // name of the tick Property in the model, required
    disable?: string;                   // name of the disable Property in the model
  };
  button?: {
    search?: boolean;
    selectAll?: boolean;
    clearAll?: boolean;
    ok?: boolean;
    cancel?: boolean;
  };
}

export interface ITreeMultiSelectTexts {
  checkAll?: string;
  uncheckAll?: string;
  ok?: string;
  cancel?: string;
  searchPlaceholder?: string;
  defaultTitle?: string;
}

@Pipe({
  name: 'treeMultiSelectFilter'
})
export class TreeMultiSelectFilter implements PipeTransform {
  /**
   * Filter to exclude end group markers and include only items selected by the filterText based on the value
   * contained in the filterProperty of the item and when the item is visible based on the treeClosed property.
   * If filterText = '' then everything is included.
   * @param items
   * @param args - Require 2 input parameter, settings.property.group, filterProperty and filterText
   * @returns display values
   */
  transform(items: Array<any>, args: Array<string>): Array<any> {
    // console.log('TreeMultiSelectFilter');
    if (args.length === 2) {
      let searchDescription: string = args[0];
      let filterText: string = args[1].toUpperCase();
      let skipLevel: number = 99;  // level containing a closed item (and so skip underneed, 99 No skip
      return items.filter((item: any) => {
        // Apply conditions
        if (skipLevel === 99 || item.groupLevel === skipLevel) {
          skipLevel = (typeof item.parentItem !== 'undefined' && typeof item.parentItem.treeClosed !== 'undefined' &&
            item.parentItem.treeClosed === true) ? item.parentItem.groupLevel : 99;
        }
        return (filterText === '' ||                                                                  // filter check
            (filterText !== '' && (typeof item[searchDescription] === 'undefined' ||
              item[searchDescription].toUpperCase().indexOf(filterText) >= 0))
          ) &&
          (item.parentItem === item ||                                                            // root level, display always
          skipLevel === 99);                                                                      // Check if visible
      });
    }

    return [];
  }
}

@Component({
  selector: 'tree-multi-select',
  templateUrl: './treeMultiSelect.component.html',
  styleUrls: ['./treeMultiSelect.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, CUSTOM_INPUT_VALIDATORS]
})
export class TreeMultiSelectComponent implements OnInit, OnChanges, ControlValueAccessor {

  // get accessor
  get outputModel(): Array<any> {
    return this._outputModel;
  }
  // set accessor including call the onchange callback
  set outputModel(model: Array<any>) {
    // console.log('set outputModel');
    if (!_.isEqual(model, this._outputModel)) {
      this._outputModel = (model !== null && model !== undefined) ? model : [];
      if (this.settings.commitOnClose === false) {
        // emit the changes result, testing if resolving multiple triggers of change event
        this.onChangeCallback(this._outputModel);
      }
    }
  }

  /**
   * check if an item has children
   * @param item - element to verify
   * @returns
   */
  private static hasChildren(item: any): boolean {
    // console.log('hasChildren');
    return (item.treeClosed !== undefined);
  }

  private static isRootElement(item: any): boolean {
    // console.log('isRootElement');
    return item.groupLevel === 1;
  }

  /**
   * Check if tree element which is open
   * @param item
   * @returns
   */
  private static isTreeOpen(item: any): boolean {
    // console.log('isTreeOpen');
    return TreeMultiSelectComponent.hasChildren(item) && item.treeClosed === false;
  }

  /**
   * remove internal added properties on the specified item
   * @param item
   */
  static doModelItemCleanUp(item: any): void {
    // console.log('doModelItemCleanUp');
    delete item['searchDescription'];
    delete item['groupLevel'];
    delete item['treeClosed'];
    delete item['parentItem'];
  }
  // list of items to display in dropdown list. List needs to be correctly ordered
  @Input() options: Array<any>;
  // control settings
  @Input() settings: ITreeMultiSelectSettings;
  @Input() texts: ITreeMultiSelectTexts;

  // callbacks options
  // Emit event handler on opening the dropdown list, emit value = true
  @Output() onOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  // Emit event handler on closing the dropdown list, emit value = true : OK action, false : Cancel action
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onItemClick: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('searchInput', { static: false }) searchInput: ElementRef;
  @ViewChildren('inputcheckbox') inputcheckboxes: QueryList<ElementRef>;
  @ViewChildren('inputlabel') inputlabels: QueryList<ElementRef>;

  // ControlValueAccessor implementation
  // The internal data model
  private _outputModel: Array<any> = [];

  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  private backUp: Array<any> = [];
  public localModel: Array<any> = [];
  private tabIndex: number = 1;  // focused element

  // helper fields
  // caption label to display based on property settings: maxLabels, buttonProperty and buttonItemMaxLen
  public caption: string;
  // Content to display in title attribut of caption
  public titleCaption: string;
  public isVisible: boolean = false;
  public searchField: FormControl = new FormControl();
  public searchFilterText: string = '';
  public hasToolbarButtons: boolean = false;
  public showToolbar: boolean = false;
  // Validator function
  private valFn: Function = Validators.nullValidator;

  /**
   * Default component selection:
   */
  private _defaultSettings: ITreeMultiSelectSettings = {
    buttonClasses: '',
    isDisabled: false,
    maxHeight: '300px',
    includeTree: false,
    selectionMode : enSelectionMode.multiple,
    maxLabels : 0,
    buttonItemMaxLen : 0,
    enableRootLevelSelection : true,
    maxNumberOfMainChapter : 0,
    minSearchLength : 2,
    searchGroup : false,
    commitOnClose : true,
    property : {
      item : '',
      key : '',
      button : '',
      tick : '',
      disable : ''
    },
    button : {
      search : false,
      selectAll : false,
      clearAll : false,
      ok : false,
      cancel : false
    }
  };

  private defaultTexts: ITreeMultiSelectTexts = {
    checkAll : 'Select all visible items',
    uncheckAll : 'Clear all visible items',
    ok : 'Ok',
    cancel : 'Cancel',
    searchPlaceholder : 'Search...',
    defaultTitle : 'Nothing selected'
  };

  constructor(private element: ElementRef, public media: MediaObserver) {
    this.options = [];
  }

  @HostListener('document: click', ['$event.target'])
  onClick(target) {
    // console.log('onClick');
    let parentFound = false;
    while (target !== null && !parentFound) {
      if (target === this.element.nativeElement) {
        parentFound = true;
      }
      target = target.parentElement;
    }
    if (!parentFound && this.isVisible) {
      this.toggleDropdown(true, false);
    }
  }

  ngOnInit() {
    this.settings = Object.assign(this._defaultSettings, this.settings);
    this.texts = Object.assign(this.defaultTexts, this.texts);
    this.searchField.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter(function(query: string) {
          return (query.length >= this.settings.minSearchLength || this.searchFilterText !== '');
        }.bind(this))
      )
      .subscribe((text: string) => {
        this.searchFilterText = (text.length >= this.settings.minSearchLength) ? text : '';
      });

    this.setToolbarSettings();
  }

  ngOnChanges(changes: SimpleChanges) {
    let fItem: any;
    let i: number;
    let fLastZeroItemIndex: number = 0; // todo see if performance can be improved

    if (changes['options'] !== undefined && changes['options'].currentValue !== undefined) { // options changes
      this.localModel = _.cloneDeep(changes['options'].currentValue);
      // 1. add treeview status detail to groupbox and reset tick property
      for (i = 0; i < this.localModel.length; i++) {
        fItem = this.localModel[i];
        // set global searchField description
        fItem.searchDescription = fItem[this.settings.property.item];
        // a. determ parent Item, group level and close tree
        if (fItem.parentid === 0) {
          fItem.parentItem = fItem;
          fItem.groupLevel = 1;
          fLastZeroItemIndex = i;
        } else {
          // retrieve level from parent element
          fItem.parentItem = _.find( this.localModel, ['id', fItem.parentid]);
          fItem.parentItem.treeClosed = true;
          fItem.groupLevel = fItem.parentItem.groupLevel + 1;
        }
        // b. reset tick property
        if (typeof fItem[this.settings.property.tick] !== 'undefined') {
          fItem[this.settings.property.tick] = false;
        }
      }

      // 2. Complete searchDescription property with all descriptions underneed
      i = 0;
      while (i < this.localModel.length) {
        i = this.updateSearchDescription(this.localModel, i);
      }

      // 3. Refresh Local model to integrate settings of output model
      this.refreshLocalModel();
    }
    if (changes['settings'] !== undefined && changes['settings'].currentValue !== undefined) { // settings changes
      this.setToolbarSettings();
    }
  }

  public validate(control: AbstractControl): {[key: string]: any} {
    // console.log('validate');
    return this.valFn(control);
  }

  public setDisabledState(isDisabled: boolean): void {
    // console.log('setDisabledState');
    // setup enable, disable
    this.settings.isDisabled = isDisabled;
  }

  // ControlValueAccessor implementation
  // Set touched on blur
  public onBlur(): void {
    // console.log('onBlur');
    this.onTouchedCallback();
  }

  // From ControlValueAccessor interface
  public writeValue(value: Array<any>): void {
    // console.log('writeValue');
    // 1. Clear the selection
    this.clearAllSelectedItems();
    // 2. SF_Update the output model
    this.outputModel = value;
    // 3. Refresh Local model to integrate settings of output model
    this.refreshLocalModel();
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: any): void {
    // console.log('registerOnChange');
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: any): void {
    // console.log('registerOnTouched');
    this.onTouchedCallback = fn;
  }

  /**
   * Check if checkbox item is available for item
   * @param item
   * @returns
   */
  public hasCheckboxProperty(item: any): boolean {
    // console.log('hasCheckboxProperty');
    return (typeof item !== 'undefined' && typeof item[this.settings.property.tick] !== 'undefined');
  }

  /**
   * Check if linked tree elements needs to be selected to
   * @param item - element to check
   * @returns true when element needs to be included
   */
  public isIncludeTickTreeItem(item: any): boolean {
    // console.log('isIncludeTickTreeItem');
    return (typeof this.settings.searchGroup !== 'undefined' && this.settings.searchGroup === true && this.settings.includeTree === true &&
    !(this.settings.selectionMode === enSelectionMode.single) && this.hasCheckboxProperty(item));
  }

  public btnClearFilter(event?: Event): void {
    // console.log('btnClearFilter');
    // 1. prevent propagation
    if (event !== undefined) {
      event.preventDefault();
      event.stopPropagation();
    }
    // 2. Clear filter
    this.searchField.setValue('');
    // 3. Set focus to first item
    this.tabIndex = 1;
    this.focusSearchInput();
  }

  /**
   * Unselect all visible elements and depending on the properties settings also the underneed values
   */
  public btnClearAll(): void {
    // console.log('btnClearAll');
    this.clearAllSelectedItems();

    this.refreshOutputModel();
    // Set focus to first item
    this.tabIndex = 1;
    this.focusSearchInput();
  }

  /**
   * Select all visible elements and depending on the properties settings also the underneed values
   */
  public btnSelectAll(): void {
    // console.log('btnSelectAll');
    // get the list of localModel filtered by the pipe
    let filteredModel = this.getFilteredModel();

    for (let item of filteredModel) {
      if (this.itemIsDisabled(item) === false) {
        if (this.hasCheckboxProperty(item)) {
          this.selectItem(item, true);
        }
      }
    }

    this.refreshOutputModel();
    // Set focus to first item
    this.tabIndex = 1;
    this.focusSearchInput();
  }

  /**
   * Keep the changes and close the list
   */
  public btnOk(): void {
    // console.log('btnOk');
    this.toggleDropdown(true);
  }

  /**
   * Cancel all changes and close the list
   */
  public btnCancel(): void {
    // console.log('btnCancel');
    this.toggleDropdown(false);
  }

  /**
   * Open or close dropdown list and trigger the corresponding open or close event handler
   * @param emitvalue - if value supplied, it will be emitted
   * @param show - predefined value, otherwise toggle the value
   */
  public toggleDropdown(emitvalue: boolean, show?: boolean): void {
    // console.log('toggleDropdown');
    this.isVisible = (show !== undefined) ? show : !this.isVisible;
    this.setToolbarSettings();

    if (this.isVisible) {
      // focus searchField Input
      this.focusSearchInput();
      // emit open action
      this.onOpen.emit(emitvalue);
    } else {
      // check if OK or cancel action
      if (emitvalue) { // ok button
        // if values are changed
        this.localModel = _.sortBy(this.localModel, [this.settings.property.item]);
        this.backUp = _.sortBy(this.backUp, [this.settings.property.item]);
        if (!_.isEqual(this.localModel, this.backUp)) {
          // update backup model base on new setting
          this.backUp = _.cloneDeep(this.localModel);
          // emit the final result, only in case of true
          this.onChangeCallback(this._outputModel);
        }
      } else {  // cancel button
        this.localModel = _.cloneDeep(this.backUp);
        this.refreshOutputModel();
      }
      // emit open action
      this.onClose.emit(emitvalue);
    }
  }

  /**
   * Check keyboard navigation, move into the tree:
   *   up, down, left (close tree item), right (open tree item)
   *   ESC to close the dropdown list and keep the changes (Ok action)
   * @param event - containing triggered key
   */
  public keyboardListener(event: any): void {
    // console.log('keyboardListener');
    let key: number = event.keyCode ? event.keyCode : event.which;
    let isNavigationKey: boolean = false;
    // get the list of localModel filtered by the pipe
    let filteredModel = this.getFilteredModel();

    // ESC key (close)
    if (key === 27) {
      event.preventDefault();
      // keep changes and close dropdown
      this.toggleDropdown(true);
    } else if (key === 40 || (!event.shiftKey && key === 9)) {  // move down ( down, tab key )
      isNavigationKey = true;
      this.tabIndex++;
      if (this.tabIndex > this.inputcheckboxes.toArray().length) {
        this.tabIndex = 1;
      }
      while (this.inputcheckboxes.toArray()[this.tabIndex - 1].nativeElement.disabled === true) {
        this.tabIndex++;
        if (this.tabIndex > this.inputcheckboxes.toArray().length) {
          this.tabIndex = 1;
        }
      }
      // set the focus
      this.setFocus(this.inputlabels.toArray()[this.tabIndex - 1]);
    } else if (key === 38 || (event.shiftKey && key === 9)) {  // move up ( up, shift+tab key )
      isNavigationKey = true;
      this.tabIndex--;
      if (this.tabIndex < 1) {
        this.tabIndex = this.inputcheckboxes.toArray().length;
      }
      while (this.inputcheckboxes.toArray()[this.tabIndex - 1].nativeElement.disabled === true) {
        this.tabIndex--;
        if (this.tabIndex < 1) {
          this.tabIndex = this.inputcheckboxes.toArray().length;
        }
      }
      this.setFocus(this.inputlabels.toArray()[this.tabIndex - 1]);
    } else if (key === 39) {  // open tree element ( right key )
      isNavigationKey = true;
      // Check if a tree element is selected
      let fItem = filteredModel[this.tabIndex - 1];
      if (fItem !== undefined && typeof fItem.treeClosed !== 'undefined' && fItem.treeClosed === true) {
        this.toggleTreeItem(fItem, event);
      }
    } else if (key === 37) {  // close tree element ( left key )
      isNavigationKey = true;
      // Check if a tree element is selected
      let fItem = filteredModel[this.tabIndex - 1];
      if (fItem !== undefined && typeof fItem.treeClosed !== 'undefined' && fItem.treeClosed === false) {
        this.toggleTreeItem(fItem, event);
      }
    } else if (key === 32) {  // space bar to check of uncheck checkbox
      if (this.settings.selectionMode === enSelectionMode.single) {
        isNavigationKey = true;
      }
      // Check if a tree element is selected
      let fItem = filteredModel[this.tabIndex - 1];
      if (fItem !== undefined) {
        if (this.settings.selectionMode === enSelectionMode.single && this.hasCheckboxProperty(fItem)) {
          this.syncItems(fItem, this.tabIndex, event);
        } else if (!(this.settings.selectionMode === enSelectionMode.single)) {
          this.syncItems(fItem, this.tabIndex, event);
        }
      }
    }

    if (isNavigationKey === true) {
      event.preventDefault();
    }
  }

  /**
   * Peform the needed updates when an item is clicked on the UI
   * @param item - item to which to apply the changes
   * @param ng_repeat_index - value to set into the tabIndex which defines the focused element
   * @param event - containing event details which triggered this function
   * @returns
   */
  public syncItems(item: any, ng_repeat_index: number, event?: any): boolean {
    // console.log('syncItems');
    if (event !== undefined) {
      event.preventDefault();
      event.stopPropagation();
    }

    // We update the index here
    this.tabIndex = ng_repeat_index;

    // if the directive is globaly disabled, do nothing
    if (this.itemIsDisabled(item)) {
      return false;
    }

    // if item is disabled, do nothing
    if (this.settings.isDisabled === true) {
      return false;
    }

    // Only check when not triggered from checkox
    // if we click on a closed note, then the node is opened only
    if (((event !== undefined && event.target.type !== 'checkbox') || event === undefined) &&
      (typeof item.treeClosed !== 'undefined' && item.treeClosed === true)) {
      item.treeClosed = false;
      // force update by replacing object
      this.localModel = Object.assign([], this.localModel);
      return true;
    }

    // Select or Unselect item and linked values depending of propery settings
    // in case of false return value, cancel further actions
    if (this.selectItem(item) === false) {
      return false;
    }

    // we execute the callback function here
    let clickedItem = Object.assign({}, item);
    if (clickedItem !== null) {
      setTimeout(function() {
        // clean up the model
        TreeMultiSelectComponent.doModelItemCleanUp(clickedItem);
        this.onItemClick.emit(clickedItem);
        clickedItem = null;
      }.bind(this), 0);
    }

    this.refreshOutputModel();
  }

  /**
   * Open or close the item element
   * @param item - item selected
   * @param event - event
   */
  public toggleTreeItem(item: any, event: any) {
    // console.log('toggleTreeItem');
    event.preventDefault();
    event.stopPropagation();

    if (typeof item.treeClosed !== 'undefined') {
      // get index of item
      item.treeClosed = !item.treeClosed;
      // force update by replacing object
      this.localModel = Object.assign([], this.localModel);
    }
  }

  public isCheckboxVisible(item: any): boolean {
    return item[this.settings.property.tick] !== undefined;
  }

  /**
   * Check if a checkbox is disabled or enabled. It will check the granular control (settings.property.disable)
   * Take note that the granular control has higher priority.
   * @param item
   * @returns
   */
  public itemIsDisabled(item: any): boolean {
    let result = ((typeof this.settings.property.disable !== 'undefined' && item[this.settings.property.disable] === true) ||
      (item[this.settings.property.tick] === false && this.settings.enableRootLevelSelection === false &&
        TreeMultiSelectComponent.hasChildren(item) && TreeMultiSelectComponent.isRootElement(item)));
    return result;
  }

  public numberOfMainChaptersExceeded(newvalue: boolean, item: any) {
    // Verification of maxNumberOfChapter
    if (newvalue === true && this.settings.maxNumberOfMainChapter > 0) {
      let rootItem = this.getRootItem(this.localModel, item);
      if (_.filter(this.outputModel, function(elem) {
        if (elem.parentid === 0 && elem.id !== rootItem.id) { return elem; }
      }).length >= this.settings.maxNumberOfMainChapter) {
        return true;
      }
    }
    return false;
  }

  /**
   * Refresh Local Model based on settings of output model and make backup
    */
  private refreshLocalModel() {
    // console.log('refreshLocalModel');
    let fItem: any;
    let fItemLocal: any;

    if (this.outputModel !== undefined && this.localModel !== undefined && this.localModel.length > 0) {
      // 1 . Include selected items from outputModel into localModel
      for (let i = 0; i < this.outputModel.length; i++) {
        fItem = this.outputModel[i];

        fItemLocal = _.find(this.localModel, [this.settings.property.key, fItem[this.settings.property.key]]);
        if (fItemLocal !== undefined) { // If found, add to list
          fItemLocal[this.settings.property.tick] = true;
        }
      }

      // 2. Keep values for reset + update layout
      this.backUp = _.cloneDeep(this.localModel);
      // 3. Refresh outputModel to correct possible mistakes
      this.refreshOutputModel();
    }
  }

  /**
   * SF_Update the searchDescription based on all sub elements
   * @param model - model structure
   * @param startIndex - start Index
   * @returns Next index value
   */
  private updateSearchDescription(model: any, startIndex: number): number {
    // console.log('updateSearchDescription');
    let itemToUpdate: any = model[startIndex];
    let item: any;
    let i: number = startIndex + 1;
    while (i < model.length && itemToUpdate.groupLevel < model[i].groupLevel) {
      item = model[i];
      // Check if contains child elements based on treeClosed property
      if (item.treeClosed !== undefined) {
        i = this.updateSearchDescription(model, i);
      }

      itemToUpdate.searchDescription += item.searchDescription;
      i++;
    }

    return i;
  }

  /**
   * Select items to display in caption button including all specified limitations
   * @param outputModel - model containing the selected items
   * @returns
   */
  private captionItems(outputModel: Array<any>): Array<any> {
    let tempMaxLabels = outputModel.length;
    if (this.settings.maxLabels !== 0 && this.settings.maxLabels < outputModel.length && !this.media.isActive('print')) {
      tempMaxLabels = this.settings.maxLabels;
    }
    // console.log('captionItems, tempMaxLabels: ' + tempMaxLabels);
    return _.slice(outputModel, 0, tempMaxLabels);
  }

  private clearAllSelectedItems(): void {
    // console.log('clearAllSelectedItems');
    // get the list of localModel filtered by the pipe
    let filteredModel = this.getFilteredModel();

    for (let item of filteredModel) {
      if (this.itemIsDisabled(item) === false) {
        if (this.hasCheckboxProperty(item)) {
          this.selectItem(item, false);
        }
      }
    }
  }

  /**
   * Select or Unselect item and linked values depending of propery settings
   * @param item - item to update
   * @param newvalue - new value to be set, optional
   * @returns false return value = cancel further actions
   */
  private selectItem(item: any, newvalue?: boolean): boolean {
    // console.log('selectItem');
    let fItem: any;

    if (typeof newvalue === 'undefined' && this.settings.property.tick !== undefined && item[this.settings.property.tick] !== undefined) {
      newvalue = !item[this.settings.property.tick];
    }

    // if newvalue set and can not be extracted from the list then cancel update
    if (typeof newvalue === 'undefined') {
      return false;
    }

    // Verification of enableRootLevelSelection
    if (newvalue === true && this.settings.enableRootLevelSelection === false && TreeMultiSelectComponent.hasChildren(item) &&
        TreeMultiSelectComponent.isRootElement(item)) {
      return false;
    }

    if (this.numberOfMainChaptersExceeded(newvalue, item)) {
      return false;
    }

    let i: number;

    // if the start of group marker is clicked ( only for multiple selection! )
    //      how it works:
    //      - if, in a group, there are items which are not selected, then they all will be selected
    //      - if, in a group, all items are selected, then they all will be de-selected
    if (TreeMultiSelectComponent.hasChildren(item) && this.isIncludeTickTreeItem(item)) {
      // this is only for multiple selection, so if selection mode is single, do nothing
      if (this.settings.selectionMode === enSelectionMode.single) {
        return false;
      }

      // update group item selection
      if (this.hasCheckboxProperty(item)) {
        item[this.settings.property.tick] = newvalue;
      }
      // correct parent item selection in case includeTree
      this.selectAllParentTree(this.localModel, item, newvalue);

      let j: number;
      let startIndex: number = 0;
      let endIndex: number = this.localModel.length - 1;
      let tempArr: Array<any> = [];

      // we loop throughout the localModel
      let index = this.localModel.indexOf(item);
      for (i = index; i < this.localModel.length; i++) {
        fItem = this.localModel[i];
        // this break will be executed when we're done processing each group
        if ((item.groupLevel >= fItem.groupLevel && i > index) || i === this.localModel.length - 1) {
          // check if all are ticked or not
          if (tempArr.length > 0) {
            // in case we are on the end of the list, 1 need to be added to the endIndex
            endIndex = (i === this.localModel.length - 1) ? this.localModel.length : i;

            for (j = startIndex; j < endIndex; j++) {
              if (TreeMultiSelectComponent.hasChildren(this.localModel[j]) === false ||
                  this.isIncludeTickTreeItem(this.localModel[j]) === true) {
                if (typeof this.settings.property.disable === 'undefined' || this.localModel[j][this.settings.property.disable] !== true) {
                  if (this.hasCheckboxProperty(this.localModel[j])) {
                    this.localModel[j][this.settings.property.tick] = newvalue;
                  }
                }
              }
            }
          }

          // exit loop
          break;
        }

        if (TreeMultiSelectComponent.hasChildren(fItem)) {
          // To cater multi level grouping
          if (tempArr.length === 0) {
            startIndex = i + 1;
          }
          if (this.hasCheckboxProperty(fItem)) { tempArr.push(fItem); }
        } else { tempArr.push(fItem); }  // create list of items to be updated
      }
    } else {  // if an item (not group marker) is clicked
      // If it's single selection mode
      if (this.settings.selectionMode === enSelectionMode.single) {
        // 1. Set everything to false
        for (i = 0; i < this.localModel.length; i++) {
          if (this.hasCheckboxProperty(this.localModel[i]) && this.localModel[i] !== item) {
            this.localModel[i][this.settings.property.tick] = false;
          }
        }

        // 2. Set the clicked item to true
        if (this.hasCheckboxProperty(item)) {
          item[this.settings.property.tick] = true;
        }

        // Keep changes and close the dropdown layer
        this.btnOk();
      } else {  // Multiple
        if (this.hasCheckboxProperty(item)) {
          item[this.settings.property.tick] = newvalue;
        }
        // SF_Update parent tick selected group if applicable
        if (this.isIncludeTickTreeItem(item) === true) {
          // correct parent item selection
          this.selectAllParentTree(this.localModel, item, newvalue);
        }
      }
    }

    return true;
  }

  private selectAllParentTree(list: Array<any>, item: any, value: boolean): void {
    // console.log('selectAllParentTree');
    let fItem: any = item;
    do {
      fItem = fItem.parentItem;
      // Check if no other child elements are selected
      if (value === false && this.hasChildSelected(list, fItem, item) === true) {
        break;
      }
      if (this.hasCheckboxProperty(fItem)) {
        fItem[this.settings.property.tick] = value;
      }
    }
    while (fItem.parentItem !== fItem);
  }

  private getRootItem(list: Array<any>, item: any): any {
    let rootItem = item;
    while (rootItem.parentid !== 0) {
      rootItem = _.find(list, ['id', rootItem.parentid]);
    }

    return rootItem;
  }

  /**
   * Verify if some child element are selected excluding the excluded item if specified
   * @param list - list of items to check
   * @param item - items for which we need to verify if child elements are selected
   * @param [exludeItem] - items to exclude from checking
   * @returns true = has selected child elements otherwise false
   */
  private hasChildSelected(list: Array<any>, item: any, exludeItem: any): boolean {
    // console.log('hasChildSelected');
    let fItem: any;
    let fReturnValue: boolean = false;
    // object used to identify if exclude item in found, it it's a groupItem and the level of the item
    let fexcludeItem: any = { found: false, groupItem: false, level: 0 };
    // get index of item
    let fIndex: number = list.indexOf(item);
    if (fIndex < list.length - 1) {
      // Search item with level = level - 1; start item
      for (let i = fIndex + 1; i < list.length; i++) {
        fItem = list[i];
        // Check if exclude item is found
        if (exludeItem === fItem) {
          fexcludeItem.found = true;
          fexcludeItem.groupItem = (TreeMultiSelectComponent.hasChildren(exludeItem) === true);
          fexcludeItem.level = exludeItem.groupLevel;
        }

        // Check if child selected
        if (fItem.groupLevel > item.groupLevel) {
          // check if item to exclude or not
          if (fexcludeItem.found === true) {
            // verify if group and end of group found to reset excluded item
            if ((fexcludeItem.groupItem === true && fItem.groupLevel <= fexcludeItem.level && fItem !== exludeItem) ||
                fexcludeItem.groupItem === false) {
              fexcludeItem.found = false;
              fReturnValue = (fItem[this.settings.property.tick] === true);
            }
          } else { fReturnValue = (fItem[this.settings.property.tick] === true); }
        } else { break; } // end of selected group passed

        if (fReturnValue === true) { break; }
      }
    }

    return fReturnValue;
  }

  private focusSearchInput(): void {
    // console.log('focusSearchInput');
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.focus();
      }
    }, 0);
  }

  private setFocus(element: ElementRef): void {
    // console.log('setFocus');
    if (element !== undefined) {
      setTimeout(() => {
        element.nativeElement.focus();
      }, 0);
    }
  }

  /**
   * get the list of localModel filtered by the pipe
   * @returns
   */
  private getFilteredModel(): Array<any> {
    // console.log('getFilteredModel');
    return new TreeMultiSelectFilter().transform(this.localModel, ['searchDescription', this.searchFilterText]);
  }

  private setToolbarSettings(): void {
    // console.log('setToolbarSettings');
    if (this.settings && this.settings.button) {
      this.hasToolbarButtons = (this.settings.button.search && this.searchFilterText.length >= this.settings.minSearchLength) ||
        this.settings.button.clearAll === true ||
        this.settings.button.selectAll === true || this.settings.button.ok === true || this.settings.button.cancel === true;
      this.showToolbar = this.isVisible === true && (this.settings.button.search === true || this.settings.button.selectAll === true ||
        this.settings.button.clearAll === true || this.settings.button.ok === true || this.settings.button.cancel === true);
    }
  }

  /**
   * Refresh of the output model (needs to be called on change of the selection)
   * Refresh titleCaption
   * Refresh caption
   */
  private refreshOutputModel(): void {
    // console.log('refreshOutputModel');
    let fOutputModel: Array<any> = [];
    let value: any;
    let index: number;

    // 1. SF_Update output model
    for (let i = 0; i < this.localModel.length; i++) {
      value = this.localModel[i];
      if (this.isTicked(value, true)) {
        index = fOutputModel.push(Object.assign({}, value));
        // clean up the model
        TreeMultiSelectComponent.doModelItemCleanUp(fOutputModel[index - 1]);
      }
    }
    // 2. update titleCaption: Content to display in title attribut of caption
    this.titleCaption = _.join(_.map(fOutputModel, function(item) {
      return item[this.settings.property.button].trim();
    }.bind(this)), '\n');
    // 3. update caption label to display based on property settings: maxLabels, buttonProperty and buttonItemMaxLen
    if (fOutputModel.length !== 0) {
      let captionItems = this.captionItems(fOutputModel);
      this.caption = _.join(_.map(captionItems, function(item) {
        let itemValue = item[this.settings.property.button].trim();
        // Trim if max number of label exceeded excluding for the print layout
        return (this.settings.buttonItemMaxLen > 0 && itemValue.length > this.settings.buttonItemMaxLen) ?
          itemValue.substring(0, this.settings.buttonItemMaxLen) + '...' : itemValue;
      }.bind(this)), ', ');
    } else {
      this.caption = this.texts.defaultTitle;
    }

    this.outputModel = fOutputModel;
  }

  /**
   * Check if item is ticked based on the settings.property.tick
   * @param item - item to be checked
   * @param value - state value to which the settings.property.tick should correspodent
   * @returns
   */
  private isTicked(item: any, value: boolean): boolean {
    // console.log('isTicked');
    return (typeof item[this.settings.property.tick] !== 'undefined' && item[this.settings.property.tick] === value);
  }
}
