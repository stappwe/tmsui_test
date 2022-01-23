import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { IFilterAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode } from 'ag-grid-community';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Subscription } from 'rxjs';
import { GeneralRoutines, TMS_DATE_FORMATS } from '../../generalRoutines';
import { MultiSelectOption } from '../../models/multiselectoption.model';
import { IMultiSelectOption } from '../../multiselect/multiselect.component';
import moment from 'moment';

export class FromToDateFilterItem extends MultiSelectOption implements IMultiSelectOption {
  isDefault: boolean;

  constructor(id?: number, name?: string, isDefault?: boolean) {
    super(id, name);
    this.isDefault = (isDefault) ? isDefault : false;
  }
}

@Component({
  selector: 'from-to-date-filter-cell',
  templateUrl: './from-to-date-filter.component.html',
  styleUrls: ['./from-to-date-filter.component.scss'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: TMS_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class FromToDateFilterComponent implements OnInit, OnDestroy, IFilterAngularComp {
  // public dateRange: DateRange;
  public minDate: Date;
  public maxDate: Date;
  public dateRangeFilterForm: FormGroup;
  public filterTypeChange: Subscription;

  private _filterTypes: Array<FromToDateFilterItem> = [];
  private params: IFilterParams;
  private guiParams: IAfterGuiAttachedParams;
  private valueGetter: (rowNode: RowNode) => any;

  @ViewChild('textInput', { read: ViewContainerRef }) public textInput;
  @ViewChild('fromDateInput', { read: ViewContainerRef }) public fromDateInput;

  get filterTypes(): Array<FromToDateFilterItem> {
    return this._filterTypes;
  }

  constructor(private formBuilder: FormBuilder) {
    this.minDate = new Date(1900, 1, 1);
    this.maxDate = new Date(2100, 12, 31);
    this.filterTypes.push(new FromToDateFilterItem(1, 'Contains'));
    this.filterTypes.push(new FromToDateFilterItem(5, 'Between'));
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
  }

  public isFilterActive(): boolean {
    let formValue = this.dateRangeFilterForm.value;
    if (formValue.filterType === 1) {
      return formValue.textFilter !== null && formValue.textFilter !== undefined && formValue.textFilter !== '';
    } else {
      return formValue.fromDate !== null || formValue.toDate !== null;
    }
  }

  public doesFilterPass(params: IDoesFilterPassParams): boolean {
    /* client side filter */
    return true;
    // todo client side filter
 /*   return this.textFilter.toLowerCase()
      .split(' ')
      .every(function (filterWord) {
        if (this.valueGetter(params.node) instanceof Date) {
          return (GeneralRoutines.isNullOrUndefined(this.valueGetter(params.node))) ?
            false : moment(this.valueGetter(params.node)).format('DD/MM/YYYY HH:mm').indexOf(filterWord) >= 0;
        } else {
          return (GeneralRoutines.isNullOrUndefined(this.valueGetter(params.node))) ?
            false : this.valueGetter(params.node).toString().toLowerCase().indexOf(filterWord) >= 0;
        }
      }.bind(this));*/
  }

  public getModel(): any {
    if (this.dateRangeFilterForm.controls['filterType'].value === 1) {
      return {
        type: 1,
        filter: this.dateRangeFilterForm.controls['textFilter'].value
      };
    } else {
      const dateRange = this.dateRangeFilterForm.value;
      return {
        type: 5,
        fromDate: dateRange.fromDate ? (moment.isMoment(dateRange.fromDate) ? dateRange.fromDate.format('DD/MM/YYYY') : dateRange.fromDate) : '',
        toDate: dateRange.toDate ? (moment.isMoment(dateRange.toDate) ? dateRange.toDate.format('DD/MM/YYYY') : dateRange.toDate) : ''
      };
    }

  }

  public setModel(model: any): void {
    //  to prevent: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value
    setTimeout(function () {
      if (model) {
        this.dateRangeFilterForm.controls['filterType'].setValue(model.type);
        if (model.type === 1) {
          this.dateRangeFilterForm.controls['textFilter'].setValue(model.filter ? model.filter : '');
        } else if (model.type === 5) {
          this.dateRangeFilterForm.controls['fromDate'].setValue(model.fromDate);
          this.dateRangeFilterForm.controls['toDate'].setValue(model.toDate);
        }
        this.dateRangeFilterForm.updateValueAndValidity();
      } else {
        this.buildForm();
      }
    }.bind(this), 0);
  }

  public afterGuiAttached(params: IAfterGuiAttachedParams): void {
    this.guiParams = params;
    // give the active input filter focus
    if (this.dateRangeFilterForm && this.dateRangeFilterForm.controls['filterType'].value === 5) {
      this.fromDateInput.element.nativeElement.focus();
    } else {
      this.textInput.element.nativeElement.focus();
    }
  }

  // todo client side filter
 /* public onFilterFromChanged(newValue: number): void {
    if (this.languageFilterForm.value.filterLanguageFrom !== newValue && this.languageFilterForm.valid === true) {
      this.languageFilterForm.value.filterLanguageFrom = newValue;
      if (this.params['apply'] && this.params['apply'] === false) {
        this.params.filterChangedCallback();
        this.guiParams.hidePopup();
      }
    }
  }*/

/*  public onFilterToChanged(newValue: number): void {
    if (this.languageFilterForm.value.filterLanguageTo !== newValue && this.languageFilterForm.valid === true) {
      this.languageFilterForm.value.filterLanguageTo = newValue;
      if (this.params['apply'] && this.params['apply'] === false) {
        this.params.filterChangedCallback();
        this.guiParams.hidePopup();
      }
    }
  }*/

  public onApplyClick(): void {
    this.params.filterChangedCallback();
    this.guiParams.hidePopup();
  }

  public static dateGroupValidator() {
    const result = function dateGroupValidate (control: FormGroup) {
      if (control.controls['filterType'].value === 5) {  // date range filter
        const fromValue = GeneralRoutines.isNumber(control.controls['fromDate'].value) ? parseFloat(control.controls['fromDate'].value) : null;
        const toValue = GeneralRoutines.isNumber(control.controls['toDate'].value) ? parseFloat(control.controls['toDate'].value) : null;
        if (fromValue === null || toValue === null || fromValue < toValue) {
          return null;
        } else {
          return {
            valueRangeError: true
          };
        }
      }

    };

    return result;
  }

  private buildForm(filterType: number = 5, textFilter: string = '', fromDate: Date = null, toDate: Date = null): void {
    // let dateRange = new DateRange(this.minDate, this.maxDate);
    this.dateRangeFilterForm = this.formBuilder.group({
      filterType: [filterType],
      textFilter: [textFilter],
      fromDate: [fromDate],
      toDate: [toDate]
    }, {
      validator: FromToDateFilterComponent.dateGroupValidator()
    });

    // subscribe to filter type changes
    if (this.filterTypeChange) {
      this.filterTypeChange.unsubscribe();
    }
    this.filterTypeChange = this.dateRangeFilterForm.controls['filterType'].valueChanges.subscribe((value: any) => {
      this.resetFields(value);
    });
  }

  private onResetClick(): void {
    this.resetFields(this.dateRangeFilterForm.controls['filterType'].value);
    this.params.filterChangedCallback();
  }

  private resetFields(type) {
    if (type === 1) {
      this.dateRangeFilterForm.controls['textFilter'].setValue('');
    } else {
      this.dateRangeFilterForm.controls['fromDate'].setValue(null);
      this.dateRangeFilterForm.controls['toDate'].setValue(null);
      this.dateRangeFilterForm.updateValueAndValidity();
    }
  }
}
