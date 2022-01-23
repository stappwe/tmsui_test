import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { IAfterGuiAttachedParams, IFilterParams } from 'ag-grid-community';
import * as moment from 'moment';

import { TextFilterComponent, TextFilterItem } from './textfilter.component';
import { ContainerType } from 'ag-grid-community/dist/lib/interfaces/iAfterGuiAttachedParams';

describe('TextFilterComponent', () => {
  let fixture: ComponentFixture<TextFilterComponent>;
  let component: TextFilterComponent;
  let params: IFilterParams;
  let guiParams: IAfterGuiAttachedParams;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [TextFilterComponent]
    }).compileComponents();
  });

  beforeEach(async() => {
    fixture = TestBed.createComponent(TextFilterComponent);
    await fixture.whenStable(); // waits for promises to complete
    fixture.detectChanges();

    component = fixture.componentInstance;
    // setup agInit
    params = {
      api: null,
      column: null,
      colDef: null,
      rowModel: null,
      filterChangedCallback: (additionalEventAttributes) => { console.log('filterChangedCallback'); },
      filterModifiedCallback: () => { console.log('filterModifiedCallback'); },
      valueGetter: (rowNode) => { return 'filtering'; },
      doesRowPassOtherFilter: null,
      context: null
    };
    guiParams = {
      container: 'columnMenu',
      hidePopup: () => {
        console.log('hidePopup');
      }
    };
    component.agInit(params);
    component.afterGuiAttached(guiParams);
  });

  afterEach(() => {
    jest.clearAllMocks();  // reset spyOn after each test
    fixture.destroy();
    component = null;
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });

  test('should contain two filterTypes and select first item via input ', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    const selectElement = fixture.debugElement.queryAll(By.css('select'))[0].nativeElement;
    component.addFilterTypes(new TextFilterItem(2, 'Sound like', true), false);
    fixture.detectChanges();
    let element = fixture.debugElement.queryAll(By.css('option'));
    expect(element.length).toBe(2);
    selectElement.value = selectElement.options[0].value;
    selectElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.filterTypeValue).toBe(1);
    expect(consoleSpy).toHaveBeenCalledTimes(0);
  });

  test('should contain two filterTypes, select first item via input and apply', () => {
    (component as any).params.apply = false;
    const consoleSpy = jest.spyOn(console, 'log');
    const selectElement = fixture.debugElement.queryAll(By.css('select'))[0].nativeElement;
    component.addFilterTypes(new TextFilterItem(2, 'Sound like', true), false);
    fixture.detectChanges();
    let element = fixture.debugElement.queryAll(By.css('option'));
    expect(element.length).toBe(2);
    selectElement.value = selectElement.options[0].value;
    selectElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.filterTypeValue).toBe(1);
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });

  test('should contain filter with text filtering and isFilterActive should be true', fakeAsync(() => {
    const consoleSpy = jest.spyOn(console, 'log');
    const inputElement = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
    inputElement.value = 'filtering';
    inputElement.dispatchEvent(new Event('input'));
    tick(100);
    fixture.detectChanges();
    expect(component.filterText).toBe('filtering');
    expect(consoleSpy).toHaveBeenCalledTimes(0);
    expect(component.isFilterActive()).toBeTruthy();
  }));

  test('should contain filter with text filtering and apply', fakeAsync(() => {
    (component as any).params.apply = false;
    const consoleSpy = jest.spyOn(console, 'log');
    const inputElement = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
    inputElement.value = 'filtering';
    inputElement.dispatchEvent(new Event('input'));
    tick(100);
    fixture.detectChanges();
    expect(component.filterText).toBe('filtering');
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  }));

  test('should trigger onApplyClick when pressing button', fakeAsync(() => {
    const consoleSpy = jest.spyOn(console, 'log');
    const buttonElement = fixture.debugElement.queryAll(By.css('button'))[0].nativeElement;
    buttonElement.dispatchEvent(new Event('click'));
    tick(100);
    fixture.detectChanges();
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  }));

  test('should check doesFilterPass and return true', () => {
    const rowNode = { node: null, data: null };
    component.filterText = 'Filtering';
    expect(component.doesFilterPass(rowNode)).toBeTruthy();
  });

  test('should check doesFilterPass and return false', () => {
    const rowNode = { node: null, data: null };
    component.filterText = 'failing';
    expect(component.doesFilterPass(rowNode)).toBeFalsy();
  });

  test('should check doesFilterPass of Date value and return true', () => {
    (component as any).valueGetter = (rownode) => { return moment('31/12/2100', 'DD/MM/YYYY').toDate(); };
    const rowNode = { node: null, data: null };
    component.filterText = '31/12/2100';
    expect(component.doesFilterPass(rowNode)).toBeTruthy();
  });

  test('should set modal and return set values', fakeAsync(() => {
    component.setModel({ type: 1, filter: 'Filtering' });
    tick(100);
    fixture.detectChanges();
    expect(component.filterText).toBe('Filtering');
    expect(component.filterTypeValue).toBe(1);
    expect(component.getModel().type).toBe(1);
    expect(component.getModel().filter).toBe('Filtering');
  }));
});
