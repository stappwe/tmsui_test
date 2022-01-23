import { ChangeDetectorRef, Component, forwardRef, Input, OnInit, ChangeDetectionStrategy, ViewChild, ViewContainerRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import { GeneralRoutines } from 'tms-library';

type OpenURLFn = (id: string) => any;

// ControlValueAccessor implementation
const noop = () => {
};

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiLinkComponent),
  multi: true
};

const CUSTOM_INPUT_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MultiLinkComponent),
  multi: true
};

@Component({
  selector: 'multi-link',
  templateUrl: './multi-link.component.html',
  styleUrls: ['./multi-link.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, CUSTOM_INPUT_VALIDATORS],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiLinkComponent implements OnInit, ControlValueAccessor {
  @Input() openURLFn: OpenURLFn;
  @Input() buttonTitle: string;
  @ViewChild('textInput', { read: ViewContainerRef }) public textInput;

  public disabled: boolean = false;
  public idList: Array<string> = [];   // list of external request ID to which this task is linked
  public editIds: boolean = false;

  private _ids: string = '';
  // Validator function
  private validateFn: Function = Validators.nullValidator;
  // Placeholders for the callbacks which are later provide
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  // get accessor
  get value(): any {
    return this._ids;
  }

  // set accessor including call the onchange callback
  set value(value: any) {
    if (value !== this._ids) {
      this._ids = value;
      this.adjust();
      this.onChangeCallback(value);
    }
  }

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  validate(control: AbstractControl): {[key: string]: any} {
    return this.validateFn(control);
  }

  setDisabledState(value: boolean): void {
    // setup enable, disable
    this.disabled = value;
    this.cdr.detectChanges();
  }

  // ControlValueAccessor implementation
  // Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  // From ControlValueAccessor interface
  writeValue(value: string) {
    this.value = value;
    this.editIds = false;
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  public getIdText(id: string, isLast: boolean): string {
    return (isLast === true) ? id : id + ', ';
  }

  public btnOpenURL(id: string): void {
    this.openURLFn(id);
  }

  public btnStartEditIds(): void {
    this.editIds = true;
    setTimeout(() => {
      if (this.textInput) {
        this.textInput.element.nativeElement.focus();
      }
    }, 0);
  }

  public btnEndEditIds(): void {
    this.editIds = false;
  }

  private adjust(): void {
    // update externalRequestIdList
    this.idList = GeneralRoutines.isNullOrUndefined(this.value) ? [] : this.value.split(',');
  }
}
