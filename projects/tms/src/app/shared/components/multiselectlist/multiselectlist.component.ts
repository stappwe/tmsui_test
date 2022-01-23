import { Component, OnInit, Input, SimpleChanges, OnChanges, forwardRef, ElementRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import * as _ from 'lodash';

import { IMultiSelectOption } from 'tms-library';

// ControlValueAccessor implementation
const noop = () => {
};

export function multiSelectListValidator(dateRangeForm: FormGroup): any {
  return function checkMultiSelectListValidator(c: FormControl) {
    return (!dateRangeForm.valid) ? { invalidDateRange: true } : null;
  };
}

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiSelectListComponent),
  multi: true
};

const CUSTOM_INPUT_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MultiSelectListComponent),
  multi: true
};

@Component({
  selector: 'multiselect-list',
  templateUrl: './multiselectlist.component.html',
  styleUrls: ['./multiselectlist.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, CUSTOM_INPUT_VALIDATORS]
})
export class MultiSelectListComponent implements OnInit, OnChanges, ControlValueAccessor {

  get selectedItems(): Array<IMultiSelectOption> {
    return this._selectedItems;
  }
  // set accessor including call the onchange callback
  set selectedItems(items: Array<IMultiSelectOption>) {
    if (!_.isEqual(items, this._selectedItems)) {
      this._selectedItems = (items !== null && items !== undefined) ? items : [];
    }
  }

  get unselectedItems(): Array<IMultiSelectOption> {
    return this._unselectedItems;
  }
  // set accessor including call the onchange callback
  set unselectedItems(items: Array<IMultiSelectOption>) {
    if (!_.isEqual(items, this._unselectedItems)) {
      this._unselectedItems = (items !== null && items !== undefined) ? items : [];
    }
  }
  // @ViewChild('selectedList', { static: false }) selectedList: ElementRef;
  // @ViewChild('unSelectedList', { static: false }) unSelectedList: ElementRef;

  @Input() availableItems: Array<IMultiSelectOption> = [];

  private _selectedIds: Array<number> = [];
  private _selectedItems: Array<IMultiSelectOption> = [];
  private _unselectedItems: Array<IMultiSelectOption> = [];

  public disabled: boolean = false;

  // Validator function
  private validateFn: Function = Validators.nullValidator;
  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['availableItems'] !== undefined && changes['availableItems'].currentValue !== undefined) {
      this.updateItemsLists();
    }
  }

  validate(control: AbstractControl): {[key: string]: any} {
    return this.validateFn(control);
  }

  setDisabledState(value: boolean): void {
    // setup enable, disable
    this.disabled = value;
  }

  // ControlValueAccessor implementation
  // Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  // From ControlValueAccessor interface
  writeValue(value: Array<number>) {
    this._selectedIds = value;
    this.updateItemsLists();
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  public addItem(unselectedList: any, selectedList: any): void {
    // todo
    // const unselectedList = unselectedList.nativeElement;
    // selectedList = selectedList.nativeElement;
/*    let opt : any;
    let result: Array<any>;

    unselectedList.options.filter()*/

    const selectedItems = _(unselectedList.options).filter(['selected', true]).map('value'); //  .filter(unselectedList.options, ['selected', true]);

    console.log(selectedItems);
    // remove items from unselected list

    /*for (var i=0, iLen=unselectedList.nativeElement.options.length; i<iLen; i++) {
      opt = unselectedList.nativeElement.options[i];

      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }*/
    // return result;
  }

  public removeItem(selectedList: any, unselectedList: any): void {
    // todo
  }

  private updateItemsLists(): void {
    // Update selected and unselected list
    this.selectedItems = _.filter(this.availableItems, function(item) {
      return this._selectedIds.indexOf(item.id) > -1;
    }.bind(this));
    this.unselectedItems = _.xor(this.availableItems, this.selectedItems);
  }
}
