import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UxDatepickerComponent } from '@eui/components';

import { QuarterDateFormatDirective } from './quarter-date-format.directive';
import * as moment from 'moment';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@Component({
  template: `
    <input #fromDateInput quarterDateFormat placeholder="Q YYYY" class="form-control" matInput [matDatepicker]="fromDatePicker"
           [formControl]="valueControl">
    <mat-datepicker-toggle matSuffix [for]="fromDatePicker" disabled></mat-datepicker-toggle>
    <mat-datepicker #fromDatePicker></mat-datepicker>`
})
class TestQuarterDateFormatDirective {
  @ViewChild('fromDateInput', { static: false }) fromDateInput: UxDatepickerComponent;

  public valueControl: FormControl = new FormControl({ value: Date.now() });
}

describe('QuarterDateFormatDirective', () => {
  let fixture: ComponentFixture<TestQuarterDateFormatDirective>;
  let component: TestQuarterDateFormatDirective;
  let fixDate: Date = moment('05/04/2020', 'DD/MM/YYYY').toDate();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatMomentDateModule
      ],
      declarations: [QuarterDateFormatDirective, TestQuarterDateFormatDirective]
    }).compileComponents();
  });

  beforeEach(async() => {
    fixture = TestBed.createComponent(TestQuarterDateFormatDirective);
    fixture.detectChanges(); // calls ngOnInit()
    await fixture.whenStable(); // waits for promises to complete
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });

  test('should set value 05/04/2020 and return 2 2020', async () => {
    component.valueControl.setValue(fixDate);
    component.valueControl.updateValueAndValidity();
    await fixture.whenStable(); // waits for promises to complete
    fixture.detectChanges();
    const inputElement = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
    expect(inputElement.value).toBe('2 2020');
  });
});
