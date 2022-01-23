import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { List } from 'immutable';
import { UxFormGroupComponentModule } from '@eui/components';
import { Observable, of, throwError } from 'rxjs';
import * as _ from 'lodash';

import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts, MultiselectDropdown } from './multiselect.component';

function generateKeyDownEvent(keyCode: number, shiftKey: boolean = false): KeyboardEvent {
  const event: KeyboardEvent = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, shiftKey: shiftKey });
  Object.defineProperty(event, 'target', { value: {} });
  Object.defineProperty(event, 'keyCode', {
    get : () => keyCode
  });
  return event;
}

@Component({
  template: `
    <multiselect-dropdown [texts]="multiSelectTexts" [options]="listItems" [formControl]="valueControl"
                          (selectionLimitReached)="onselectionLimitReached($event)"
                          (onClose)="onClose($event)"
                          [settings]="cbSettings"></multiselect-dropdown>`
})
class TestMultiselectDropdown {
  @ViewChild(MultiselectDropdown)
  public multiselectDropdown: MultiselectDropdown;

  public multiSelectTexts: IMultiSelectTexts = { defaultTitle: 'component default title details...' };
  public cbSettings: IMultiSelectSettings = {
    maxLabels: 3,
    commitOnClose : true,
    button: {
      search: true,
      selectAll: true,
      clearAll: true
    }
  };
  public listItems: IMultiSelectOption[] = [
    { id : 10, name : 'item component 10' },
    { id : 20, name : 'item component 20' },
    { id : 25, name : 'item component 25' },
    { id : 30, name : 'item component 30' },
    { id : 40, name : 'item component 40' },
    { id : 50, name : 'item component 50' }
  ];
  public valueControl: FormControl = new FormControl({ value: null, disabled: false });

  public onselectionLimitReached(totalItems: number): void {
    console.log('selectionLimitReached triggered');
  }

  public onClose(value: boolean): void {
    console.log('onClose triggered');
  }
}

@Component({
  template: `
    <multiselect-dropdown [texts]="multiSelectTexts" [options]="listItems" [formControl]="valueControl" [settings]="cbSettings"
                          [refreshDropdownList]="refreshListItems.bind(this)"
                          (selectionChanged)="onSelectionChanged($event)"></multiselect-dropdown>`
})
class TestMultiselectDropdownWithRefresh {
  @ViewChild(MultiselectDropdown)
  public multiselectDropdown: MultiselectDropdown;

  public multiSelectTexts: IMultiSelectTexts = { defaultTitle: 'component default title details...' };
  public cbSettings: IMultiSelectSettings = {
    maxLabels: 3,
    commitOnClose : true,
    button: {
      search: true,
      selectAll: true,
      clearAll: true
    }
  };
  public listItems: IMultiSelectOption[] = [];
  public dataItems: IMultiSelectOption[] = [
    { id : 10, name : 'item component 10' },
    { id : 20, name : 'item component 20' },
    { id : 25, name : 'item component 25' },
    { id : 30, name : 'item component 30' },
    { id : 40, name : 'item component 40' },
    { id : 50, name : 'item component 50' }
  ];
  public valueControl: FormControl = new FormControl({ value: null, disabled: false });
  public refreshListItems(search: string): Observable<Array<IMultiSelectOption> | {}> {
    return of(_.filter(this.dataItems, function(item) {
      return item.name.contains(search);
    }));
  }

  public onSelectionChanged($event: Array<number>): void {
    console.log('onSelectionChanged');
  }
}

describe('MultiselectDropdown', () => {
  describe('WithoutRefresh', () => {
    let fixture: ComponentFixture<TestMultiselectDropdown>;
    let component: TestMultiselectDropdown;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule,
          UxFormGroupComponentModule
        ],
        declarations: [MultiselectDropdown, TestMultiselectDropdown]
      }).compileComponents();
    });

    beforeEach(async() => {
      fixture = TestBed.createComponent(TestMultiselectDropdown);
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

    test('should set value and disable component', async () => {
      component.valueControl.setValue([10, 20]);
      component.valueControl.disable();
      component.valueControl.updateValueAndValidity();
      await fixture.whenStable(); // waits for promises to complete
      fixture.detectChanges();
      const element = fixture.debugElement.queryAll(By.css('button'));
      expect(component.valueControl.value.length).toEqual(2);
      expect(element[0].nativeElement.hasAttribute('disabled')).toBeTruthy();
    });

    test('should set search value to item 2 and return a list of 2 items', fakeAsync(() => {
      const buttonElement = fixture.debugElement.queryAll(By.css('button'))[0];
      buttonElement.triggerEventHandler('click', {});
      fixture.detectChanges();
      const inputElement = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
      inputElement.value = 'component 2';
      inputElement.dispatchEvent(new Event('input'));
      tick(1000);
      fixture.detectChanges();
      expect(component.multiselectDropdown.filteredOptions.length).toEqual(2);
    }));

    test('should update settings and reflect this in the UI', () => {
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      expect(buttonListElement.length).toEqual(1);
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      expect(buttonListElement.length).toEqual(3);
      component.cbSettings = {
        maxLabels: 3,
        commitOnClose : true,
        button: {
          search: true,
          selectAll: false,
          clearAll: false
        }
      };
      fixture.detectChanges();
      buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      expect(buttonListElement.length).toEqual(1);
    });

    test('should set the selected items > 25 and only display max 2 items in the caption', () => {
      component.cbSettings = {
        maxLabels: 2,
        buttonItemMaxLen: 5,
        commitOnClose : true,
        button: {
          search: true,
          selectAll: false,
          clearAll: false
        }
      };
      component.multiselectDropdown.selectedItems = List<number>([30, 40, 50]);
      fixture.detectChanges();
      expect(component.multiselectDropdown.captionItems.size).toEqual(2);
    });

    test('should select the first and second item form the list and deselect 1 item again', () => {
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      const label1Element = fixture.debugElement.queryAll(By.css('label'))[0];
      const label2Element = fixture.debugElement.queryAll(By.css('label'))[1];
      label1Element.nativeElement.click();
      label2Element.nativeElement.click();
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(2);
      label1Element.nativeElement.click();
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(1);
    });

    test('should select max 1 item', () => {
      component.cbSettings = { ...component.cbSettings, selectionLimit: 1 };
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      const label1Element = fixture.debugElement.queryAll(By.css('label'))[0];
      const label2Element = fixture.debugElement.queryAll(By.css('label'))[1];
      label1Element.nativeElement.click();
      label2Element.nativeElement.click();
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(1);
      label1Element.nativeElement.click();
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(1);
      label1Element.nativeElement.click();
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(0);
    });

    test('should not select item on disabled component', () => {
      component.cbSettings = { ...component.cbSettings, isDisabled: true };
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      const label1Element = fixture.debugElement.queryAll(By.css('label'))[0];
      component.cbSettings = { ...component.cbSettings, isDisabled: true };
      label1Element.nativeElement.click();
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(0);
      component.valueControl.disable();
      component.valueControl.updateValueAndValidity();
      fixture.detectChanges();
      label1Element.nativeElement.click();
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(0);
    });

    test('should close the dropdown list on select', () => {
      component.cbSettings = { ...component.cbSettings, closeOnSelect: true };
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      const label1Element = fixture.debugElement.queryAll(By.css('label'))[0];
      label1Element.nativeElement.click();
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(1);
      expect(component.multiselectDropdown.isVisible).toEqual(false);
    });

    test('should emit selectionLimitReached event', () => {
      const selectionLimitReachedSpy = jest.spyOn(component, 'onselectionLimitReached');
      component.cbSettings = { ...component.cbSettings, selectionLimit: 2 };
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      const label1Element = fixture.debugElement.queryAll(By.css('label'))[0];
      const label2Element = fixture.debugElement.queryAll(By.css('label'))[1];
      const label3Element = fixture.debugElement.queryAll(By.css('label'))[2];
      label1Element.nativeElement.click();
      label2Element.nativeElement.click();
      label3Element.nativeElement.click();
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(2);
      expect(selectionLimitReachedSpy).toHaveBeenCalledTimes(1);
    });

    test('should trigger btnSelectAll and select all items', () => {
      component.cbSettings = { ...component.cbSettings,
        button : {
          search : true,
          selectAll : true,
          clearAll : true
        }
      };
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[1].triggerEventHandler('click', {});  // btnSelectAll
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(6);
    });

    test('should trigger btnClearAll and deselect all items', () => {
      component.cbSettings = { ...component.cbSettings,
        button : {
          search : true,
          selectAll : true,
          clearAll : true
        }
      };
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      const label1Element = fixture.debugElement.queryAll(By.css('label'))[0];
      const label2Element = fixture.debugElement.queryAll(By.css('label'))[1];
      const label3Element = fixture.debugElement.queryAll(By.css('label'))[2];
      label1Element.nativeElement.click();
      label2Element.nativeElement.click();
      label3Element.nativeElement.click();
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(3);
      buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[2].triggerEventHandler('click', {});  // btnClearAll
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(0);
    });

    test('should trigger btnClearFilter and reset the filter value', fakeAsync(() => {
      component.cbSettings = { ...component.cbSettings,
        button : {
          search : true,
          selectAll : true,
          clearAll : true
        }
      };
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      component.multiselectDropdown.searchField.setValue('component 2');
      component.multiselectDropdown.searchField.updateValueAndValidity();
      tick(500);
      fixture.detectChanges();
      expect(component.multiselectDropdown.filteredOptions.length).toEqual(2);
      const clearFilterBtnElement = fixture.debugElement.queryAll(By.css('button'))[1];
      clearFilterBtnElement.nativeElement.click();
      tick(500);
      fixture.detectChanges();
      expect(component.multiselectDropdown.filteredOptions.length).toEqual(6);
      expect(component.multiselectDropdown.searchField.value).toEqual('');
    }));

    test('should clear the search filter by the function clearSearchFilter', fakeAsync(() => {
      component.cbSettings = { ...component.cbSettings,
        button : {
          search : true,
          selectAll : true,
          clearAll : true
        }
      };
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      component.multiselectDropdown.searchField.setValue('component 2');
      component.multiselectDropdown.searchField.updateValueAndValidity();
      tick(500);
      fixture.detectChanges();
      expect(component.multiselectDropdown.filteredOptions.length).toEqual(2);
      component.multiselectDropdown.clearSearchFilter();
      tick(500);
      fixture.detectChanges();
      expect(component.multiselectDropdown.filteredOptions.length).toEqual(6);
      expect(component.multiselectDropdown.searchField.value).toEqual('');
    }));

    test('should select 1 item and press btnOK should close and trigger onClose event ', () => {
      const onCloseSpy = jest.spyOn(component, 'onClose');
      component.cbSettings = { ...component.cbSettings,
        button : {
          search : true,
          selectAll : true,
          clearAll : true,
          ok : true,
          cancel : true
        }
      };
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      const label1Element = fixture.debugElement.queryAll(By.css('label'))[0];
      label1Element.nativeElement.click();
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(1);
      buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[3].triggerEventHandler('click', {});  // btnOk
      fixture.detectChanges();
      expect(onCloseSpy).toHaveBeenCalledTimes(1);
      expect(component.multiselectDropdown.selectedItems.size).toEqual(1);
    });

    test('should select 1 item and press btnCancel should close and trigger onClose event ', () => {
      const onCloseSpy = jest.spyOn(component, 'onClose');
      component.cbSettings = { ...component.cbSettings,
        button : {
          search : true,
          selectAll : true,
          clearAll : true,
          ok : true,
          cancel : true
        }
      };
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      const label1Element = fixture.debugElement.queryAll(By.css('label'))[0];
      label1Element.nativeElement.click();
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(1);
      buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[4].triggerEventHandler('click', {});  // btnOk
      fixture.detectChanges();
      expect(onCloseSpy).toHaveBeenCalledTimes(1);
      expect(component.multiselectDropdown.selectedItems.size).toEqual(0);
    });

    test('should select 1 item and press keyboard tab key and select next item by using the space bar ', () => {
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      const inputElement = fixture.debugElement.queryAll(By.css('input'));
      inputElement[1].nativeElement.dispatchEvent(generateKeyDownEvent(32));
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(1);
      inputElement[1].nativeElement.dispatchEvent(generateKeyDownEvent(9));
      fixture.detectChanges();
      expect((component.multiselectDropdown as any).tabIndex).toEqual(2);
      inputElement[2].nativeElement.dispatchEvent(generateKeyDownEvent(32));
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(2);
    });

    test('should keyboard first item and last item navigation', () => {
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      const inputElement = fixture.debugElement.queryAll(By.css('input'));
      inputElement[1].nativeElement.dispatchEvent(generateKeyDownEvent(9, true));
      fixture.detectChanges();
      expect((component.multiselectDropdown as any).tabIndex).toEqual(6);
      inputElement[6].nativeElement.dispatchEvent(generateKeyDownEvent(9));
      fixture.detectChanges();
      expect((component.multiselectDropdown as any).tabIndex).toEqual(1);
    });

    test('should trigger keyboard close event', () => {
      const onCloseSpy = jest.spyOn(component, 'onClose');
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      const inputElement = fixture.debugElement.queryAll(By.css('input'));
      inputElement[1].nativeElement.dispatchEvent(generateKeyDownEvent(27));
      fixture.detectChanges();
      expect(onCloseSpy).toHaveBeenCalledTimes(1);
    });

    test('should select only enabled items in move down', () => {
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      const labelElement = fixture.debugElement.queryAll(By.css('label'))[4];
      labelElement.nativeElement.click();
      fixture.detectChanges();
      expect((component.multiselectDropdown as any).tabIndex).toEqual(5);
      const inputElement = fixture.debugElement.queryAll(By.css('input'));
      inputElement[6].nativeElement.disabled = true;
      labelElement.nativeElement.dispatchEvent(generateKeyDownEvent(40));
      fixture.detectChanges();
      expect((component.multiselectDropdown as any).tabIndex).toEqual(1);
    });

    test('should select only enabled items in move up', () => {
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      const labelElement = fixture.debugElement.queryAll(By.css('label'))[1];
      labelElement.nativeElement.click();
      fixture.detectChanges();
      expect((component.multiselectDropdown as any).tabIndex).toEqual(2);
      const inputElement = fixture.debugElement.queryAll(By.css('input'));
      inputElement[1].nativeElement.disabled = true;
      labelElement.nativeElement.dispatchEvent(generateKeyDownEvent(38));
      fixture.detectChanges();
      expect((component.multiselectDropdown as any).tabIndex).toEqual(6);
    });

    test('should set focus to first input element', fakeAsync(() => {
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      const inputElement = fixture.debugElement.queryAll(By.css('input'));
      (component.multiselectDropdown as any).setFocus(inputElement[0]);
      tick(100);
      fixture.detectChanges();
      expect(inputElement[0].nativeElement).toEqual(document.activeElement);
    }));

    test('should trigger blur event', () => {
      const onBlurSpy = jest.spyOn(component.multiselectDropdown, 'onBlur');
      let divListElement = fixture.debugElement.queryAll(By.css('div'));
      divListElement[0].nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(onBlurSpy).toHaveBeenCalled();
    });
  });

  describe('WithRefresh', () => {
    let fixture: ComponentFixture<TestMultiselectDropdownWithRefresh>;
    let component: TestMultiselectDropdownWithRefresh;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule,
          UxFormGroupComponentModule,
          MatProgressSpinnerModule
        ],
        declarations: [MultiselectDropdown, TestMultiselectDropdownWithRefresh]
      }).compileComponents();
    });

    beforeEach(async() => {
      fixture = TestBed.createComponent(TestMultiselectDropdownWithRefresh);
      fixture.detectChanges(); // calls ngOnInit()
      await fixture.whenStable(); // waits for promises to complete
      fixture.detectChanges();

      component = fixture.componentInstance;
      // Load list
      component.multiselectDropdown.refresh();
    });

    afterEach(() => {
      fixture.destroy();
      component = null;
    });

    test('should be created', () => {
      expect(component).toBeTruthy();
    });

    test('should set search value to item 2 and return a list of 2 items', fakeAsync(() => {
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      expect(buttonListElement.length).toEqual(1);
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      const inputElement = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
      inputElement.value = 'item component 2';
      inputElement.dispatchEvent(new Event('input'));
      tick(1000);
      fixture.detectChanges();
      expect(component.multiselectDropdown.filteredOptions.length).toEqual(2);
    }));

    test('should emit selected values on toggleDropdown', async () => {
      const onSelectionChangedSpy = jest.spyOn(<any>component, 'onSelectionChanged');
      component.valueControl.setValue([10, 20]);
      component.valueControl.updateValueAndValidity();
      await fixture.whenStable(); // waits for promises to complete
      fixture.detectChanges();
      component.multiselectDropdown.toggleDropdown(true, false);
      fixture.detectChanges();
      expect(onSelectionChangedSpy).toHaveBeenCalledTimes(1);
    });

    test('should trigger selectionChanged', () => {
      const onSelectionChangedSpy = jest.spyOn(<any>component, 'onSelectionChanged');
      component.cbSettings = { ...component.cbSettings, commitOnClose : false };
      fixture.detectChanges();
      component.multiselectDropdown.btnSelectAll();
      fixture.detectChanges();
      expect(onSelectionChangedSpy).toHaveBeenCalledTimes(1);
    });

    test('should trigger document click event', () => {
      component.multiselectDropdown.toggleDropdown(false, true);
      fixture.detectChanges();
      const toggleDropdownSpy = jest.spyOn(<any>component.multiselectDropdown, 'toggleDropdown');
      const multiSelectDropdownElement = fixture.debugElement.queryAll(By.css('multiselect-dropdown'))[0].nativeElement;
      component.cbSettings = { ...component.cbSettings, closeOnSelect : false };
      fixture.detectChanges();
      // fixture.nativeElement.dispatchEvent(new Event('click'));
      document.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();
      expect(toggleDropdownSpy).toHaveBeenCalledTimes(1);
      component.multiselectDropdown.onClick(multiSelectDropdownElement);
      fixture.detectChanges();
      expect(toggleDropdownSpy).toHaveBeenCalledTimes(1);
    });

    test('should trigger error on refresh', fakeAsync(() => {
      component.refreshListItems = jest.fn().mockReturnValue(throwError('trace error logging'));
      const consoleSpy = jest.spyOn(console, 'log');
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      expect(buttonListElement.length).toEqual(1);
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      const inputElement = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
      inputElement.value = 'item component 2';
      inputElement.dispatchEvent(new Event('input'));
      tick(1000);
      fixture.detectChanges();
      expect(consoleSpy).toHaveBeenCalled();
    }));

    test('should remove missing items from selection', fakeAsync(() => {
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      expect(buttonListElement.length).toEqual(1);
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      component.valueControl.setValue([10, 20]);
      component.valueControl.updateValueAndValidity();
      tick(1000);
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(2);
      const inputElement = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
      inputElement.value = 'item component 2';
      inputElement.dispatchEvent(new Event('input'));
      tick(1000);
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(1);
    }));

    test('should keep missing items from selection', fakeAsync(() => {
      component.cbSettings = { ...component.cbSettings, keepSelectedValue : true };
      let buttonListElement = fixture.debugElement.queryAll(By.css('button'));
      expect(buttonListElement.length).toEqual(1);
      buttonListElement[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      component.valueControl.setValue([10, 20]);
      component.valueControl.updateValueAndValidity();
      tick(1000);
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(2);
      const inputElement = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
      inputElement.value = 'item component 2';
      inputElement.dispatchEvent(new Event('input'));
      tick(1000);
      fixture.detectChanges();
      expect(component.multiselectDropdown.selectedItems.size).toEqual(2);
      expect(component.multiselectDropdown.optionsList.length).toEqual(3);
    }));
  });
});
