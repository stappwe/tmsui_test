import {
  Component, OnInit, OnChanges, ViewChild, forwardRef, ElementRef, EventEmitter, Input, Output,
  HostListener, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, FormControl, Validators } from '@angular/forms';

import { GeneralRoutines } from '../generalRoutines';

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextareaWithSizeComponent),
  multi: true
};

export const CUSTOM_INPUT_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => TextareaWithSizeComponent),
  multi: true
};

@Component({
  selector: 'textarea-with-size',
  templateUrl: './textareaWithSize.component.html',
  styleUrls : ['./textareaWithSize.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, CUSTOM_INPUT_VALIDATORS],
  // changeDetection: ChangeDetectionStrategy.OnPush // -> not working for unit test
})
export class TextareaWithSizeComponent implements OnInit, OnChanges, ControlValueAccessor {
  // get accessor
  get value(): any {
    return this.innerValue;
  }

  // set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }
  @Input() class: string;
  @Input() autosize: boolean = false;
  @Input() height: string = '';
  @Input() showSizeInfo: boolean = false;
  @Input() maxBytes: number = 0;
  @Input() readOnly: boolean = false;
  @Input() placeholder: string = '';
  @Input() text: string;

  @ViewChild('textArea', { static: false }) textArea: ElementRef;

  public sizeInfo: string = '';
  public maxLengthInBytes: number = 524288; // default value
  public _InputValid: boolean = true;

  // ControlValueAccessor implementation
  // The internal data model
  private innerValue: any = '';

  // Placeholders for the callbacks which are later providesd
  // by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  // Validator function
  private validateFn: Function = Validators.nullValidator;

  constructor(private cdr: ChangeDetectorRef) {
    // do nothing
  }

  @HostListener('window:resize')
  public onInput(): void {
    this.adjust();
  }

  ngOnInit(): void {
    this.adjust();
  }

  ngOnChanges(changes) {
    if (changes['class']?.currentValue !== undefined) {
      this.class = changes['class'].currentValue;
    }
    if (changes['autosize']?.currentValue !== undefined) {
      this.autosize = changes['autosize'].currentValue;
      this.adjust();
    }
    if (changes['height']?.currentValue !== undefined) {
      this.height = changes['height'].currentValue;
      this.adjust();
    }
    if (changes['showSizeInfo']?.currentValue !== undefined) {
      this.showSizeInfo = changes['showSizeInfo'].currentValue;
      this.adjust();
    }
    if (changes['maxBytes']?.currentValue !== undefined) {
      this.maxBytes = changes['maxBytes'].currentValue;
      this.validateFn = GeneralRoutines.maxByteSizeValidator(this.maxBytes);
      this.adjust();
    }
    if (changes['text']?.currentValue !== undefined) {
      this.value = changes['text'].currentValue;
      this.adjust();
    }
  }

  validate(c: FormControl) {
    return this.validateFn(c);
  }

  setDisabledState(isDisabled: boolean): void {
    // setup enable, disable
    this.readOnly = isDisabled;
    this.cdr.detectChanges();
  }

  // ControlValueAccessor implementation
  // Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
      this.adjust();
    }
  }

  // From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  // From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  private adjust(): void {
    if (this.textArea) {
      let _usedBytes: number;
      // Autosize setting
      if (this.autosize === true) {
        this.textArea.nativeElement.style.overflow = 'hidden';
        this.textArea.nativeElement.style.height = 'auto';
        this.textArea.nativeElement.style.height = this.textArea.nativeElement.scrollHeight + 'px';
      } else if (this.height !== '') {
        this.textArea.nativeElement.style['overflow-y'] = 'auto';
        this.textArea.nativeElement.style.height = this.height;
      }
      _usedBytes = GeneralRoutines.getByteLen(this.innerValue);
      // MaxBytes and ui maxLength correction
      if (this.maxBytes !== 0) {
        let innerValueLength = (this.innerValue?.length) ? this.innerValue.length : 0;
        this.maxLengthInBytes = (this.maxBytes + (innerValueLength - _usedBytes));
      }
      // Display of Byte information
      if (this.showSizeInfo === true) {
        this.sizeInfo = '' + _usedBytes;
        if (this.maxBytes !== 0) {
          this.sizeInfo = this.sizeInfo + '/' + this.maxBytes;
        }
      }
      // Check if change in _InputValid value. If so, emit it
      let _NewInputValid = (this.maxBytes === 0) || (_usedBytes <= this.maxBytes);
      if (this._InputValid !== _NewInputValid) {
        this._InputValid = _NewInputValid;
      }
    }
  }
}
