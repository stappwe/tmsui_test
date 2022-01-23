import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode } from 'ag-grid-community';
import { IFilterAngularComp } from 'ag-grid-angular';
import * as _ from 'lodash';
import * as moment_ from 'moment';

const moment = moment_;

import { MultiSelectOption } from '../../models/multiselectoption.model';
import { IMultiSelectOption } from '../../multiselect/multiselect.component';
import { GeneralRoutines } from '../../generalRoutines';

export class TextFilterItem extends MultiSelectOption implements IMultiSelectOption {
  isDefault: boolean;

  constructor(id?: number, name?: string, isDefault?: boolean) {
    super(id, name);
    this.isDefault = (isDefault) ? isDefault : false;
  }
}

@Component({
  selector: 'text-filter-cell',
  templateUrl: './textfilter.component.html',
  styleUrls: ['./textfilter.component.css']
})
export class TextFilterComponent implements IFilterAngularComp {
  public filterText: string = '';
  public filterTypeValue: number = 1;

  private _filterTypes: Array<TextFilterItem> = [];
  private params: IFilterParams;
  private guiParams: IAfterGuiAttachedParams;
  private valueGetter: (rowNode: RowNode) => any;
  private enableServerSideFilter: boolean = false;

  @ViewChild('input', { read: ViewContainerRef }) public input;

  get filterTypes(): Array<TextFilterItem> {
    return this._filterTypes;
  }

  constructor() {
    this.filterTypes.push(new TextFilterItem(1, 'Contains'));
  }

  public addFilterTypes(value: TextFilterItem, enableServerSideFilter: boolean) {
    this.enableServerSideFilter = enableServerSideFilter;
    this.filterTypes.push(value);
    if (value.isDefault === true) {
      this.filterTypeValue = value.id as number;
    }
  }

  public agInit(params: IFilterParams): void {
    this.params = params;
    this.valueGetter = params.valueGetter;
  }

  public isFilterActive(): boolean {
    return this.filterText !== null && this.filterText !== undefined && this.filterText !== '';
  }

  public doesFilterPass(params: IDoesFilterPassParams): boolean {
    if (this.enableServerSideFilter === false) {

      /* client side */
      return this.filterText.toLowerCase()
        .split(' ')
        .every(function (filterWord) {
          if (this.valueGetter(params.node) instanceof Date) {
            return (GeneralRoutines.isNullOrUndefined(this.valueGetter(params.node))) ?
              false : moment(this.valueGetter(params.node)).format('DD/MM/YYYY HH:mm').indexOf(filterWord) >= 0;
          } else {
            return (GeneralRoutines.isNullOrUndefined(this.valueGetter(params.node))) ?
              false : this.valueGetter(params.node).toString().toLowerCase().indexOf(filterWord) >= 0;
          }
        }.bind(this));
    } else {
      return true;
    }
  }

  public getModel(): any {
    if (this.filterText !== null && this.filterText !== undefined && this.filterText !== '') {
      let id = (_.filter(this.filterTypes, { 'id': this.filterTypeValue }).length > 0) ?
        _.filter(this.filterTypes, { 'id': this.filterTypeValue })[0].id : this.filterTypes[0].id;
      return { type: id, filter: this.filterText };
    } else {
      return undefined;
    }
  }

  public setModel(model: any): void {
    //  to prevent: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value
    setTimeout(function () {
      this.filterTypeValue = (model && _.filter(this.filterTypes, { 'id': model.type }).length > 0) ?
        (_.filter(this.filterTypes, { 'id': model.type })[0] as TextFilterItem).id : 1;
      this.filterText = model ? model.filter : '';
    }.bind(this), 0);
  }

  public afterGuiAttached(params: IAfterGuiAttachedParams): void {
    this.guiParams = params;
    this.input.element.nativeElement.focus();
  }

  public onFilterTypeChanged(newValue: number): void {
    if (this.filterTypeValue !== newValue) {
      this.filterTypeValue = newValue;
      if (!GeneralRoutines.isNullOrUndefined(this.params['apply']) && this.params['apply'] === false) {
        this.params.filterChangedCallback();
        this.guiParams.hidePopup();
      }
    }
  }

  public onFilterChanged(newValue: string): void {
    if (this.filterText !== newValue) {
      this.filterText = newValue;
      if (!GeneralRoutines.isNullOrUndefined(this.params['apply']) && this.params['apply'] === false) {
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
    this.input.element.nativeElement.value = '';
    this.filterText = '';
    this.params.filterChangedCallback();
  }
}
