import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';

import { IFilterAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import * as _ from 'lodash';

import { MultiSelectOption } from '../../models/multiselectoption.model';
import { IMultiSelectOption } from '../../multiselect/multiselect.component';
import { GeneralRoutines } from '../../generalRoutines';

export class MultiSelectFilterItem extends MultiSelectOption implements IMultiSelectOption {
  public isDefault: boolean;

  constructor(id?: number | string, name?: string, isDefault?: boolean) {
    super(id, name);
    this.isDefault = (isDefault) ? isDefault : false;
  }
}

@Component({
  selector: 'multi-select-filter-cell',
  templateUrl: './multi-select-filter.component.html',
  styleUrls: ['./multi-select-filter.component.scss']
})
export class MultiSelectFilterComponent implements OnInit, OnDestroy, IFilterAngularComp {
  public multiSelectFilterForm: FormGroup;
  public filterTypeChange: Subscription;

  private _filterTypes: Array<MultiSelectFilterItem> = [];
  private params: IFilterParams;
  private guiParams: IAfterGuiAttachedParams;
  private valueGetter: (rowNode: RowNode) => any;
  private _selectedFilerItemsText: Array<string> = [];
  private _values: Array<MultiSelectOption> = [];

  @ViewChild('input', { read: ViewContainerRef }) public input;

  get filterTypes(): Array<MultiSelectFilterItem> {
    return this._filterTypes;
  }

  get values(): Array<MultiSelectOption> {
    if (this._values.length === 0 && this.params.context.parent.getMultiSelectValues(this.params.colDef)) {
      let list = this.params.context.parent.getMultiSelectValues(this.params.colDef);
      for (let item of list) {
        this._values.push(Object.assign(new MultiSelectOption(), item));
      }
      // update checkbox values
      this.updateCheckboxSelection();
    }
    return this._values;
  }

  get selectedFilerItems(): Array<number | string> {
    return this.multiSelectFilterForm ? this.multiSelectFilterForm.get('selectedFilerItems').value : [];
  }
  set selectedFilerItems(values: Array<number | string>) {
    this.multiSelectFilterForm.controls['selectedFilerItems'].setValue(values);
    this.updateCheckboxSelection();
    // compose temp text for local filtering
    if (this.multiSelectFilterForm.controls['filterType'].value !== 1) {
      this._selectedFilerItemsText = _.map(_.filter(this.values, (item) => { return values.includes(item.id); }), 'name');
    }
  }

  constructor(private formBuilder: FormBuilder) {
    this.filterTypes.push(new MultiSelectFilterItem(1, 'Contains'));
    this.filterTypes.push(new MultiSelectFilterItem(6, 'Multi select'));
  }

  ngOnInit() {
    this.buildForm();
  }

  ngOnDestroy() {
    if (this.filterTypeChange) {
      this.filterTypeChange.unsubscribe();
    }
  }

  public agInit(params: IFilterParams): void {
    this.params = params;
    this.valueGetter = params.valueGetter;

    if (!params.context.parent || !params.context.parent.getMultiSelectValues) {
      throw new Error('Context parent component or getMultiSelectValues function is missing!');
    } else if (typeof params.context.parent.getMultiSelectValues !== 'function') {
      throw new Error('Context parent getMultiSelectValues function for loading the selection list returns the wrong data type!');
    }
  }

  public isFilterActive(): boolean {
    let formValue = this.multiSelectFilterForm.value;
    if (formValue.filterType === 1) {
      return formValue.textFilter !== null && formValue.textFilter !== undefined && formValue.textFilter !== '';
    } else {
      return formValue.selectedFilerItems.length > 0;
    }
  }

  public doesFilterPass(params: IDoesFilterPassParams): boolean {
    /* client side filter - not implemented currently */
    if (!GeneralRoutines.isNullOrUndefined(this.valueGetter(params.node))) {
      if (this.multiSelectFilterForm.controls['filterType'].value === 1) {
        let nodeValue = this.valueGetter(params.node).toString().toLowerCase();
        let filterText = this.multiSelectFilterForm.controls['textFilter'].value.trim();
        if (filterText !== '') {
          return filterText.toLowerCase()
              .split(' ')
              .every(function (filterWord) {
                return nodeValue.indexOf(filterWord) >= 0;
              }.bind(this));
        }

        return true;
      } else {
        let nodeValue = this.valueGetter(params.node).toString();
        //   let formValue = this.multiSelectFilterForm.value;
        //   return _.map(_.filter(this.values, function(item) { return formValue.selectedFilerItems.includes(item.id); }), 'name')
        //     .includes(nodeValue);
        let formValue = this.multiSelectFilterForm.value;
        return _.map(_.filter(this.values, function(item) { return formValue.selectedFilerItems.includes(item.id); }), 'name')
          .includes(nodeValue);
        // return this._selectedFilerItemsText.inArray((value: string) => { return nodeValue.contains(value); });
      }
    } else {
      return false;
    }
  }

  public getModel(): any {
    if (this.multiSelectFilterForm.controls['filterType'].value === 1) {
      let textFilter = this.multiSelectFilterForm.controls['textFilter'].value;
      if (textFilter !== null && textFilter !== undefined && textFilter !== '') {
        return {
          type: 1,
          filter: this.multiSelectFilterForm.controls['textFilter'].value
        };
      } else {
        return undefined;
      }
    } else {
      if (this.selectedFilerItems.length > 0) {
        return {
          type: 6,
          filter: this.selectedFilerItems.join(',')
        };
      } else {
        return undefined;
      }
    }
  }

  public setModel(model: any): void {
    //  to prevent: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value
    setTimeout(function () {
      if (model) {
        this.multiSelectFilterForm.controls['filterType'].setValue(model.type);
        if (model.type === 1) {
          this.multiSelectFilterForm.controls['textFilter'].setValue(model.filter ? model.filter : '');
        } else if (model.type === 6) {
          this.selectedFilerItems = model.filter.split(',').map(value => GeneralRoutines.isNumber(value) ? Number(value) : value);
        }
        this.multiSelectFilterForm.updateValueAndValidity();
      } else {
        this.onResetClick();
        this.buildForm();
      }
    }.bind(this), 0);
  }

  public afterGuiAttached(params: IAfterGuiAttachedParams): void {
    // if (this.values.length === 0 && this.params.context.parent.getMultiSelectValues(this.params.colDef)) {
    //   this.params.context.parent.getMultiSelectValues(this.params.colDef).pipe(first()).subscribe(
    //     list => {
    //       for (let item of list) {
    //         this.values.push(Object.assign(new MultiSelectOption(), item));
    //       }
    //       // update checkbox values
    //       this.updateCheckboxSelection();
    //     },
    //     errMsg => {
    //       console.log('Selection list loading failed - ' + errMsg);
    //     }
    //   );
    // }
    this.guiParams = params;
    this.input.element.nativeElement.focus();
  }

  public onFilterChanged(): void {
    if (this.multiSelectFilterForm.valid === true) {
      if (this.params['apply'] && this.params['apply'] === false) {
        this.params.filterChangedCallback();
        this.guiParams.hidePopup();
      }
    }
  }
  public onApplyClick(): void {
    this.params.filterChangedCallback();
    this.guiParams.hidePopup();
  }

  public onResetClick(): void {
    this.selectedFilerItems = [];
    this.params.filterChangedCallback();
  }

  public onToggleCheckbox($event: MatSelectionListChange): void {
    $event.option.value.checked = !$event.option.value.checked;
    let newValues = _.map(_.filter(this.values, ['checked', true]), 'id');
    this.multiSelectFilterForm.controls['selectedFilerItems'].setValue(newValues);
    // compose temp text for local filtering
    if (this.multiSelectFilterForm.controls['filterType'].value !== 1) {
      this._selectedFilerItemsText = _.map(_.filter(this.values, (item) => { return newValues?.includes(item.id); }), 'name');
    }
    this.onFilterChanged();
  }

  private updateCheckboxSelection(): void {
    // Update checkbox checked value
    let checkedValues = this.selectedFilerItems;
    for (let item of this._values) {
      item.checked = checkedValues.includes(item.id) === true;
    }
  }

  private buildForm(filterType: number = 6, textFilter: string = '', selectedFilerItems: any[] = []): void {
    this.multiSelectFilterForm = this.formBuilder.group({
      filterType: [filterType],
      textFilter: [textFilter],
      selectedFilerItems: [selectedFilerItems]
    });

    if (this.filterTypeChange) {
      this.filterTypeChange.unsubscribe();
    }

    this.filterTypeChange = this.multiSelectFilterForm.controls['filterType'].valueChanges.subscribe((value: any) => {
      if (value === 1) {  // text filter - contains
        // remove unneeded settings
        this.selectedFilerItems = [];
      } else {
        this.multiSelectFilterForm.controls['textFilter'].setValue([]);
      }
      this.multiSelectFilterForm.updateValueAndValidity();
    });
  }
}
