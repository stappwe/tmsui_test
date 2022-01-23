import { Component, forwardRef, Input, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { TMS_DATE_FORMATS } from '../generalRoutines';
import { Subscription } from 'rxjs';

// ControlValueAccessor implementation
const noop = () => {
};

export function rangeDatePickerValidator(dateRangeForm: FormGroup): any {
  return function checkDateRangeValidator(c: FormControl) {
    return (!dateRangeForm.valid) ? { invalidDateRange: true } : null;
  };
}

const CUSTOM_INPUT_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => RangeDatePickerComponent),
  multi: true
};

export class DateRange {
  constructor(public startDate?: Date, public endDate?: Date) {}

  public isExternalFilterPresent(): boolean {
    return (this.startDate !== undefined && this.endDate !== undefined && this.startDate <= this.endDate);
  }
}

@Component({
  selector: 'range-date-picker',
  templateUrl: './rangedatepicker.component.html',
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: TMS_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeDatePickerComponent),
      multi: true},
    CUSTOM_INPUT_VALIDATORS
  ]
})
export class RangeDatePickerComponent implements OnChanges, ControlValueAccessor, OnDestroy {
  private _dateRange: DateRange;
  private _idSubscription: Subscription;
  // Validator function
  private validateFn: Function = Validators.nullValidator;
  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  public dateRangeForm: FormGroup;

  @Input() minDate: Date = new Date(1900, 1, 1);
  @Input() maxDate: Date = new Date(2100, 12, 31);
  @Input() startDateRequired: boolean = true;
  @Input() endDateRequired: boolean = true;
  @Input() startDateDisabled: boolean = false;
  @Input() endDateDisabled: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['minDate'] !== undefined && changes['minDate'].currentValue !== undefined) {
      this.dateRangeForm.updateValueAndValidity();
    }
    if (changes['maxDate'] !== undefined && changes['maxDate'].currentValue !== undefined) {
      this.dateRangeForm.updateValueAndValidity();
    }
    if (changes['startDateRequired'] !== undefined && changes['startDateRequired'].currentValue !== undefined) {
      this.setRequired(this.dateRangeForm.controls['startDate'], this.startDateRequired);
    }
    if (changes['endDateRequired'] !== undefined && changes['endDateRequired'].currentValue !== undefined) {
      this.setRequired(this.dateRangeForm.controls['endDate'], this.endDateRequired);
    }
    if (changes['startDateDisabled'] !== undefined && changes['startDateDisabled'].currentValue !== undefined) {
      this.setDisable(this.dateRangeForm.controls['startDate'], this.startDateDisabled);
    }
    if (changes['endDateDisabled'] !== undefined && changes['endDateDisabled'].currentValue !== undefined) {
      this.setRequired(this.dateRangeForm.controls['endDate'], this.endDateDisabled);
    }
  }

  ngOnDestroy() {
    if (this._idSubscription) {
      this._idSubscription.unsubscribe();
    }
  }

  public btnDisable(element) {
    this.setDisabledState(element.checked);
  }

  validate(control: AbstractControl): {[key: string]: any} {
    return this.validateFn(control);
  }

  setDisabledState(value: boolean): void {
    // setup enable, disable
    if (value === true) {
      this.dateRangeForm.disable();
    } else { this.dateRangeForm.enable(); }
  }

  // ControlValueAccessor implementation
  // Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  // From ControlValueAccessor interface
  writeValue(value: DateRange) {
    this._dateRange = value;
    this.buildForm();
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  private setRequired(control: AbstractControl, value: boolean): void {
    if (value === true) {
      control.setValidators(Validators.required);
    } else {
      control.setValidators(null);
    }
    this.dateRangeForm.updateValueAndValidity();
  }

  private setDisable(control: AbstractControl, value: boolean): void {
    if (value === true) {
      control.disable();
    } else {
      control.enable();
    }
    this.dateRangeForm.updateValueAndValidity();
  }

  private buildForm(): void {
    if (this._idSubscription) {
      this._idSubscription.unsubscribe();
    }
    let startDateValidation = (this.startDateRequired === true) ? Validators.required : null;
    let endDateValidation = (this.endDateRequired === true) ? Validators.required : null;
    this.dateRangeForm = this.formBuilder.group({
      startDate : [{ value: (this._dateRange) ? this._dateRange.startDate : undefined, disabled: this.startDateDisabled } , startDateValidation],
      endDate: [{ value: (this._dateRange) ? this._dateRange.endDate : undefined, disabled: this.endDateDisabled }, endDateValidation],
    });
    this.validateFn = rangeDatePickerValidator(this.dateRangeForm);

    this._idSubscription = this.dateRangeForm.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe((text: string) => {
      let dateRange = new DateRange(this.dateRangeForm.getRawValue().startDate, this.dateRangeForm.getRawValue().endDate);
      this.onChangeCallback(dateRange);
    });
  }
}
