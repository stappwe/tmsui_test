import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode } from 'ag-grid-community';
import { IFilterAngularComp } from 'ag-grid-angular';

import * as _ from 'lodash';
import { first } from 'rxjs/operators';

import { GeneralRoutines, IMultiSelectOption, MultiSelectOption } from 'tms-library';

@Component({
  selector: 'language-filter-cell',
  templateUrl: './languagefilter.component.html',
  styleUrls: ['./languagefilter.component.css']
})
export class LanguageFilterComponent implements OnInit, IFilterAngularComp {
  public filterLanguageFrom: number = -1;
  public filterLanguageTo: number = -1;
  public languages: Array<MultiSelectOption> = [];
  public languageFilterForm: FormGroup;

  private params: IFilterParams;
  private guiParams: IAfterGuiAttachedParams;
  private valueGetter: (rowNode: RowNode) => any;

  @ViewChild('input', { read: ViewContainerRef }) public input;

  constructor(private formBuilder: FormBuilder) {
    // do nothing
  }

  ngOnInit() {
    this.languageFilterForm = this.formBuilder.group({
      filterLanguageFrom: [-1, GeneralRoutines.emptyIDValidator],
      filterLanguageTo: [-1, GeneralRoutines.emptyIDValidator],
    }, {
      validator: GeneralRoutines.compareValidator('filterLanguageFrom', 'filterLanguageTo', false)
    });
  }

  public agInit(params: IFilterParams): void {
    this.params = params;
    this.valueGetter = params.valueGetter;
    if (!params.context.parent || !params.context.parent.getLanguages) {
      throw new Error('Context parent component or getLanguages function is missing!');
    } else if (typeof params.context.parent.getLanguages !== 'function') {
      throw new Error('Context parent getLanguages function for loading LanguageList returns the wrong data type!');
    } else {
      params.context.parent.getLanguages().pipe(first()).subscribe(
        data => {
          for (let lang of data) {
            this.languages.push(Object.assign(new MultiSelectOption(), lang));
          }
        },
        errMsg => {
          console.log('Language list loading failed - ' + errMsg);
        }
      );
    }
  }

  public isFilterActive(): boolean {
    return this.languageFilterForm.controls['filterLanguageFrom'].value !== -1 && this.languageFilterForm.controls['filterLanguageTo'].value !== -1;
  }

  public doesFilterPass(params: IDoesFilterPassParams): boolean {
    /* client side not possible to implement */
    return true;
  }

  public getModel(): any {
    return {
      type: 3,
      from: this.languageFilterForm.controls['filterLanguageFrom'].value !== -1 ? this.languageFilterForm.controls['filterLanguageFrom'].value : null,
      to: this.languageFilterForm.controls['filterLanguageTo'].value !== -1 ? this.languageFilterForm.controls['filterLanguageTo'].value : null
    };
  }

  public setModel(model: any): void {
    //  to prevent: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value
    setTimeout(function () {
      this.languageFilterForm.controls['filterLanguageFrom'].setValue((model && _.filter(this.languages, { 'id': model.from }).length > 0) ?
        (_.filter(this.languages, { 'id': model.from })[0] as IMultiSelectOption).id : -1);
      this.languageFilterForm.controls['filterLanguageTo'].setValue((model && _.filter(this.languages, { 'id': model.to }).length > 0) ?
        (_.filter(this.languages, { 'id': model.to })[0] as IMultiSelectOption).id : -1);
      this.languageFilterForm.updateValueAndValidity();
    }.bind(this), 0);
  }

  public afterGuiAttached(params: IAfterGuiAttachedParams): void {
    this.guiParams = params;
    this.input.element.nativeElement.focus();
  }

  public onFilterFromChanged(): void {
    if (this.languageFilterForm.valid === true) {
      if (this.params['apply'] && this.params['apply'] === false) {
        this.params.filterChangedCallback();
        this.guiParams.hidePopup();
      }
    }
  }

  public onFilterToChanged(): void {
    if (this.languageFilterForm.valid === true) {
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
}
