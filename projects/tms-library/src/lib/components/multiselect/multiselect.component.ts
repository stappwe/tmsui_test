import {
  Component, OnInit, OnChanges, HostListener, ViewChildren, QueryList, Input, forwardRef, ElementRef,
  Output, EventEmitter, SimpleChanges, ViewChild, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, FormControl, AbstractControl, Validators } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { List } from 'immutable';

import * as _ from 'lodash';
import { MultiSelectOption } from '../models/multiselectoption.model';
import '../objectExtensions';

// ControlValueAccessor implementation
const noop = () => {
};

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiselectDropdown),
  multi: true
};

const CUSTOM_INPUT_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MultiselectDropdown),
  multi: true
};

export interface IMultiSelectOption {
  id: number | string;
  name: string;
  disabled?: boolean;
}

export type refreshDropdownListFunction = (search: string, size: number) => Observable<Array<IMultiSelectOption>>;

export interface IMultiSelectSettings {
  buttonClasses?: string;               // additional text class to add to the button text
  isDisabled?: boolean;
  maxHeight?: string;
  maxLabels?: number;                   // maximum number of labels that will be displayed, 0 = no limitations
  buttonItemMaxLen?: number;            // Maximum length of the Item displayed in the text area, 0 = no Limitation
  minSearchLength?: number;             // Minimum searchField length needed before start searching, default = 2, min 1
  selectionLimit?: number;
  maxDropdownListSize?: number;          // Maximum numer of items allowed in the dropdown list, default 0 = no limitation
  closeOnSelect?: boolean;
  commitOnClose?: boolean;               // Commit the changes only on close of the component. Default but can be changed
  keepSelectedValue?: boolean;           // keep the current value of the selected item in the option list
  button?: {
    search?: boolean;
    selectAll?: boolean;
    clearAll?: boolean;
    ok?: boolean;
    cancel?: boolean;
  };
}

export interface IMultiSelectTexts {
  checkAll?: string;
  uncheckAll?: string;
  ok?: string;
  cancel?: string;
  searchPlaceholder?: string;
  defaultTitle?: string;
}

export interface IRefresh {
  search: string;
  size: number;
}

@Component({
  selector: 'multiselect-dropdown',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, CUSTOM_INPUT_VALIDATORS]
})
export class MultiselectDropdown implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {

  // get accessor
  get selectedItems(): List<number | string> {
    return this._selectedItems;
  }
  // set accessor including call the onchange callback
  set selectedItems(items: List<number | string>) {
    // console.log('selectedItems');
    if (items !== this._selectedItems) {
      this._selectedItems = items; // (items !== null && items !== undefined) ? items : List.of([]);
      // update caption
      this.setCaption();
      // update titleCaption
      this.setTitleCaption();
    }
  }

  /**
   * Select items to display in caption button including all specified limitations
   * @returns
   */
  get captionItems(): List<number | string> {
    // console.log('captionItems');
    let tempMaxLabels: number = this.selectedItems.size;
    if (this.settings.maxLabels !== 0 && this.settings.maxLabels < this.selectedItems.size) {
      tempMaxLabels = this.settings.maxLabels;
    }
    return <List<number | string>>this.selectedItems.slice(0, tempMaxLabels);
  }
  // list of items to display in dropdown list
  @Input() options: Array<IMultiSelectOption>;
  // control settings
  @Input() settings: IMultiSelectSettings;
  @Input() texts: IMultiSelectTexts;
  // Function used to populate the dropdown list based on the searchFilterText and the maxDropdownListSize
  @Input() refreshDropdownList: refreshDropdownListFunction;

  // callbacks
  // Emit event handler on opening the dropdown list, emit value = true
  @Output() onOpen: EventEmitter<boolean> = new EventEmitter<boolean>();
  // Emit event handler on closing the dropdown list, emit value = true : OK action, false : Cancel action
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  // Emit event handler on closing the changes
  @Output() selectionChanged: EventEmitter<Array<number | string>> = new EventEmitter<Array<number | string>>();
  @Output() selectionLimitReached = new EventEmitter<number>();

  @ViewChild('searchInput', { static: false }) searchInput: ElementRef;
  @ViewChildren('inputcheckbox') inputcheckboxes: QueryList<ElementRef>;
  @ViewChildren('inputlabel') inputlabels: QueryList<ElementRef>;

  public optionsList: Array<MultiSelectOption>;  // internal list containing a extra checkbox

  // stored data to limit number of events
  public caption: string;
  public titleCaption: string;
  public filteredOptions: Array<MultiSelectOption>;
  public hasToolbarButtons: boolean = false;
  public showToolbar: boolean = false;
  public isDisabled: boolean = false;
  public isLoading: boolean = false;

  // ControlValueAccessor implementation
  // The internal data model
  private _selectedItems: List<number | string>;

  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  public isVisible: boolean = false;
  public searchField = new FormControl();
  public searchFilterText: string = '';
  private _backUp: List<number | string> = List.of();  // source used to track the changes
  private tabIndex: number = 1;  // focused element
  private makeRequest$: Subject<IRefresh>; // observable loop

  // Validator function
  private valFn: Function = Validators.nullValidator;

  private defaultSettings: IMultiSelectSettings = {
    buttonClasses : 'btn btn-default',
    isDisabled : false,
    maxHeight : '300px',
    maxLabels : 0,
    buttonItemMaxLen : 0,
    minSearchLength : 2,
    selectionLimit : 0,
    maxDropdownListSize : 0,
    closeOnSelect : false,
    commitOnClose : false,
    keepSelectedValue : false,
    button : {
      search : false,
      selectAll : false,
      clearAll : false,
      ok : false,
      cancel : false
    }
  };
  public defaultTexts: IMultiSelectTexts = {
    checkAll : 'Select all visible items',
    uncheckAll : 'Clear all visible items',
    ok : 'Ok',
    cancel : 'Cancel',
    searchPlaceholder : 'Search...',
    defaultTitle : 'Nothing selected'
  };

  constructor(private element: ElementRef, private cdr: ChangeDetectorRef) {
    this.options = [];
    this.optionsList = [];
    this.filteredOptions = [];
  }

  @HostListener('document: click', ['$event.target'])
  onClick(target) {
    // console.log('onclick');
    if (this.settings.closeOnSelect === false) {
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
  }

  ngOnInit() {
    // console.log('ngOnInit');
    this.settings = Object.assign(this.defaultSettings, this.settings);
    this.texts = Object.assign(this.defaultTexts, this.texts);
    this.selectedItems = List.of();
    if (this.refreshDropdownList) {
      this.searchField.valueChanges
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          filter(function(search: string) {
            return (search.length >= this.settings.minSearchLength || this.searchFilterText !== '');
          }.bind(this))
        // .do(_ => this.loading = true)
        )
        .subscribe((text: string) => {
          this.searchFilterText = text;
          if (this.searchFilterText !== '') {
            this.refresh();
          }
        });
    } else {
      this.searchField.valueChanges
        .pipe(
        debounceTime(250),
          distinctUntilChanged(),
          filter((query: string) => {
            return (query.length >= this.settings.minSearchLength || this.searchFilterText !== '');
          })
        )
        .subscribe((text: string) => {
          this.searchFilterText = text;
          this.setFilteredOptions();
        });
    }
    this.setToolbarSettings();
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('ngOnChanges');
    if (changes['options'] !== undefined && changes['options'].currentValue !== undefined) { // options changes
      // only update if option list is changed!
      if (JSON.stringify(changes['options'].previousValue) === undefined ||
        JSON.stringify(changes['options'].currentValue) !== JSON.stringify(changes['options'].previousValue)) {
        this.optionsList = this.options.map((item: IMultiSelectOption) =>
          new MultiSelectOption(item.id, (item.name)
            ? ((typeof item.name === 'string') ? item.name.trim() : item.name)
            : '', item.disabled)
        );
        // Remove items from the selected items which are not available in the dropdown list
        // Keep values for reset + update layout
        // First backup, then set selected items to prevent extra actions done by the getter and setter of the selected items
        this.selectedItems =
          List<number | string>(_.intersection(this.selectedItems ? this.selectedItems.toArray() : [], _.map(this.optionsList, 'id')));
        this._backUp = this.selectedItems.asImmutable(); // _.clone(this.selectedItems);
        // Mark checkbox as check for the selected items
        this.optionsList.forEach(function (option: MultiSelectOption) {
          option.checked = this.selectedItems.indexOf(option.id) > -1;
        }.bind(this));
        // set filter optionsList
        this.setFilteredOptions();
      }
    }
    if (changes['settings'] !== undefined && changes['settings'].currentValue !== undefined) { // settings changes
      this.settings = Object.assign(this.defaultSettings, changes['settings'].currentValue);
      this.setToolbarSettings();
    }
    if (changes['refreshDropdownList'] !== undefined && changes['refreshDropdownList'].currentValue !== undefined) {
      // Construct the refresh observable to prevent overwriting older requests
      if (this.makeRequest$ === undefined) {
        this.makeRequest$ = new Subject();
        this.makeRequest$.pipe(
          switchMap((refresh: IRefresh) => {
            this.isLoading = true;
            return this.refreshDropdownList(refresh.search, refresh.size);
          }),
          tap(() => {
            this.isLoading = false;
          })
        ).subscribe(
          (data: Array<IMultiSelectOption>) => {
            // Based on the settings, update and correct the selected items and the options list
            this.addRemoveMissingOptions(data);
          },
          errMsg => {
            console.log('List loading error: ' + errMsg);
          }
        );
      }
    }
    if (changes['texts'] !== undefined && changes['texts'].currentValue !== undefined) { // texts changes
      this.texts = Object.assign(this.defaultTexts, changes['texts'].currentValue);
      // update caption
      this.setCaption();
      // update titleCaption
      this.setTitleCaption();
    }
  }

  ngOnDestroy() {
    if (this.makeRequest$) {
      this.makeRequest$.unsubscribe();
    }
  }

  public refresh() {
    if (this.makeRequest$) {
      this.makeRequest$.next({ search: this.searchFilterText, size: this.settings.maxDropdownListSize });
    }
  }

  validate(control: AbstractControl): {[key: string]: any} {
    // console.log('validate');
    return this.valFn(control);
  }

  setDisabledState(isDisabled: boolean): void {
    // setup enable, disable
    this.isDisabled = isDisabled;
    this.cdr.detectChanges();
  }

  // ControlValueAccessor implementation
  // Set touched on blur
  public onBlur(): void {
    // console.log('onBlur');
    this.onTouchedCallback();
  }

  // From ControlValueAccessor interface
  public writeValue(value: Array<number | string>) {
    // console.log('writeValue');
    // 1. Set value and keep values for reset + update layout
    this.selectedItems = List<number | string>(value);
    // 2. Mark checkbox as check for the selected items
    this.optionsList.forEach(function (option: MultiSelectOption) {
      option.checked = this.selectedItems.indexOf(option.id) > -1;
    }.bind(this));
    // 3. Backup used in case of cancel
    this._backUp = this.selectedItems.asImmutable(); // _.clone(this.selectedItems);
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  /**
   * caption label to display based on the selected items
   */
  setCaption(): void {
    // console.log('caption');
    let _caption: string = '';
    if (this.selectedItems && this.selectedItems.size !== 0) {
      let _captionItems = this.captionItems;
      _caption = this.optionsList
        .filter((option: MultiSelectOption) => _captionItems.indexOf(option.id) > -1)
        .map((option: MultiSelectOption) => {
          let value = option.name.toString();
          return (this.settings.buttonItemMaxLen > 0 && value.length > this.settings.buttonItemMaxLen) ?
            value.substring(0, this.settings.buttonItemMaxLen) + '...' : value;
        })
        .join(', ');
      if (this.settings.maxLabels !== 0 && this.settings.maxLabels < this.selectedItems.size) {
        _caption = _caption + '...';
      }
    } else {
      _caption = this.texts.defaultTitle;
    }

    this.caption = _caption;
  }

  /**
   * Content to display in title attribute of title caption element on the UI
   */
  setTitleCaption(): void {
    // console.log('titleCaption');
    this.titleCaption = this.optionsList
      .filter((option: MultiSelectOption) => this.selectedItems.indexOf(option.id) > -1)
      .map((option: MultiSelectOption) => option.name)
      .join('\n');
  }

  /**
   * get the list of option filtered by the pipe
   * @returns
   */
  setFilteredOptions(): void {
    // console.log('setFilteredOptions');
    let _filterOptions = [];
    if (this.refreshDropdownList) {
      _filterOptions = this.optionsList;
    } else {
      let searchFilter = this.searchFilterText.toLowerCase();
      _filterOptions = this.optionsList
        .filter((option: MultiSelectOption) => option.name.toString().toLowerCase().indexOf(searchFilter) > -1);
    }

    this.filteredOptions = _filterOptions;
    this.setToolbarSettings();
  }

  setToolbarSettings(): void {
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
        if (!_.isEqual(this.selectedItems.sort(), this._backUp.sort())) {
          // update backup model base on new setting
          this._backUp = this.selectedItems.asImmutable(); // _.cloneDeep(this.selectedItems);
          // emit the changes result
          this.onChangeCallback(this.selectedItems.toArray());
        }
      } else {  // cancel button
        this.selectedItems = _.cloneDeep(this._backUp);
        // Mark checkbox as check for the selected items
        this.optionsList.forEach(function (option: MultiSelectOption) {
          option.checked = this.selectedItems.indexOf(option.id) > -1;
        }.bind(this));
      }
      // emit open action
      this.selectionChanged.emit(this.selectedItems.toArray());
      this.onClose.emit(emitvalue);
    }
  }

  /**
   * Peform the needed updates when an item is clicked on the UI
   * @param option - option to which to apply the changes
   * @param ng_repeat_index - value to set into the tabIndex which defines the focused element
   * @param event - containing event details which triggered this function
   */
  public setSelected(option: MultiSelectOption, ng_repeat_index: number, event?: Event): void {
    // console.log('setSelected');
    if (event !== undefined) {
      event.preventDefault();
      event.stopPropagation();
    }

    // We update the index here
    this.tabIndex = ng_repeat_index;
    this.setFocus(this.inputcheckboxes.toArray()[this.tabIndex - 1]);

    // if item is disabled, do nothing
    if (this.settings.isDisabled === true || option.disabled === true) {
      return;
    }

    let index = this.selectedItems.indexOf(option.id);
    if (index > -1) {
      this.selectedItems = this.selectedItems.delete(index);
      option.checked = false;
    } else {
      if (this.settings.selectionLimit === 1) {
        // update current item
        if (this.selectedItems.size > 0) {
          let items = this.optionsList.filter((item: MultiSelectOption) => item.checked);
          if (items.length > 0) {
            items[0].checked = false;
          }
        }
        // make new setting
        this.selectedItems = List<number | string>([option.id]);
        option.checked = true;
      } else {
        if (this.settings.selectionLimit === 0 || this.selectedItems.size < this.settings.selectionLimit) {
          this.selectedItems = this.selectedItems.push(option.id);
          option.checked = true;
        } else {
          this.selectionLimitReached.emit(this.selectedItems.size);
          return;
        }
      }
    }
    if (this.settings.closeOnSelect) {
      this.toggleDropdown(true);
    }

    this.selectedItemsChanged();
  }

  public btnSelectAll(): void {
    // 1. Check all items inside visible elements
    this.selectedItems = List<number | string>(_.uniq(this.filteredOptions.map(option => option.id).concat(this.selectedItems.toArray())));
    // 2. Mark checkbox to true for the filteredOptions items
    this.filteredOptions.forEach((option: MultiSelectOption) => option.checked = true);
    // 3. Set focus to first item
    this.tabIndex = 1;
    this.focusSearchInput();
    // 4. emit event if needed
    this.selectedItemsChanged();
  }

  public btnClearAll(): void {
    // 1. Clear all items inside visible elements
    let clearItems: Array<number | string> = this.filteredOptions.map(option => option.id);
    this.selectedItems = List<number | string>(_.xor(clearItems, clearItems.concat(this.selectedItems.toArray())));
    // 2. Mark checkbox to false for the filteredOptions items
    this.filteredOptions.forEach((option: MultiSelectOption) => option.checked = false);
    // 3. Set focus to first item
    this.tabIndex = 1;
    this.focusSearchInput();
    // 4. emit event if needed
    this.selectedItemsChanged();
  }

  public btnClearFilter(event?: Event): void {
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
   * Keep the changes and close the list
   */
  public btnOk(): void {
    this.toggleDropdown(true);
  }

  /**
   * Cancel all changes and close the list
   */
  public btnCancel(): void {
    this.toggleDropdown(false);
  }

  public clearSearchFilter(): void {
    this.searchField.setValue('');
    this.searchField.updateValueAndValidity();
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
      this.setFocus(this.inputcheckboxes.toArray()[this.tabIndex - 1]);
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
      this.setFocus(this.inputcheckboxes.toArray()[this.tabIndex - 1]);
    } else if (key === 32) {  // space bar to check of uncheck checkbox
      isNavigationKey = true;
      if (this.filteredOptions[this.tabIndex - 1] !== undefined) {
        this.setSelected(this.filteredOptions[this.tabIndex - 1], this.tabIndex);
      }
    }

    if (isNavigationKey === true) {
      event.preventDefault();
    }
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

  private selectedItemsChanged(): void {
    if (this.settings.commitOnClose === false) {
      // console.log('selectedItemsChanged');
      // emit the changes result, testing if resolving multiple triggers of change event
      this.onChangeCallback(this.selectedItems.toArray());
      // Emit selection change
      this.selectionChanged.emit(this.selectedItems.toArray());
    }
  }

  private addRemoveMissingOptions(newItemList: Array<IMultiSelectOption>) {
    let missingSelectedItems: Array<number | string> = [];
    let missingOptions: Array<IMultiSelectOption> = [];
    // Extract missing items in the new dropdown list
    let newItemsId = newItemList.map((item) => item.id);
    missingSelectedItems = this.selectedItems.toArray().filter(function (value) {
      return newItemsId.indexOf(value) === -1;
    });
    if (this.settings.keepSelectedValue === false) {
      // remove missing selected items from the selection
      missingSelectedItems.forEach((value: number | string) => {
        // this._selectedItems.remove(value);
        let index = this.selectedItems.indexOf(value);
        if (index > -1) {
          this.selectedItems = this.selectedItems.delete(index);
        }
      });
    } else {
      // get missing options base on the missing item list
      missingOptions = this.options.filter(function (item) {
        return missingSelectedItems.indexOf(item.id) !== -1;
      });
    }
    // Add missing selected items
    if (missingOptions.length > 0 ) {
      missingOptions.forEach((item: IMultiSelectOption) => newItemList.push(item));
    }
    // set options list
    this.options = newItemList;
    // update internal option list
    this.optionsList.clear();
    this.options.forEach((item: IMultiSelectOption) =>
      this.optionsList.push(new MultiSelectOption(item.id, (item.name)
        ? ((typeof item.name === 'string') ? item.name.trim() : item.name)
        : '', item.disabled)
      ));
    // Mark checkbox as check for the selected items
    this.optionsList.forEach(function (option: MultiSelectOption) {
      option.checked = this.selectedItems.indexOf(option.id) > -1;
    }.bind(this));
    // set filter optionsList
    this.setFilteredOptions();
  }
}
