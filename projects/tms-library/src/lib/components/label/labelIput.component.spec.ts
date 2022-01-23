import { TestBed, ComponentFixture } from '@angular/core/testing';

import { of } from 'rxjs';

import { LabelInputComponent } from './labelInput.component';
import { MediaObserver } from '@angular/flex-layout';
import { SimpleChange } from '@angular/core';

describe('LabelInputComponent', () => {
  describe('normal device - lg', () => {
    let fixture: ComponentFixture<LabelInputComponent>;
    let component: LabelInputComponent;
    let element: HTMLElement;

    let mediaObserverStub = {
      media$: of({ mqAlias: 'lg' })
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [LabelInputComponent],
        providers: [
          { provide: MediaObserver, useValue: mediaObserverStub }
        ]
      }).compileComponents();
    });

    beforeEach(async() => {
      fixture = TestBed.createComponent(LabelInputComponent);
      fixture.detectChanges(); // calls ngOnInit()
      await fixture.whenStable(); // waits for promises to complete
      fixture.detectChanges();

      component = fixture.componentInstance;
    });

    afterEach(() => {
      jest.clearAllMocks();  // reset spyOn after each test
      fixture.destroy();
      component = null;
    });

    test('should be in lg format', () => {
      expect((<any>component).xsDevice).toBeFalsy();
    });

    test('should labelAlign be calling setAddLabelClass and set addLabelClass to Top', () => {
      const setAddLabelClassSpy = jest.spyOn(<any>component, 'setAddLabelClass');
      component.ngOnChanges({ 'labelAlign': new SimpleChange(null, 'Top', true) });
      expect(setAddLabelClassSpy).toHaveBeenCalled();
      expect(component.addLabelClass).toBe('label-align-top');
    });

    test('should labelAlign set addLabelClass to Center', () => {
      component.ngOnChanges({ 'labelAlign': new SimpleChange(null, 'Center', true) });
      expect(component.addLabelClass).toBe('label-align-center');
    });

    test('should labelAlign set addLabelClass to Bottom', () => {
      component.ngOnChanges({ 'labelAlign': new SimpleChange(null, 'Bottom', true) });
      expect(component.addLabelClass).toBe('label-align-bottom');
    });

    test('should labelAlign set addLabelClass to blank', () => {
      component.ngOnChanges({ 'labelAlign': new SimpleChange(null, 'Other', true) });
      expect(component.addLabelClass).toBe('');
    });

    test('should labelTitle set displayLabel set to labelTitle', () => {
      component.ngOnChanges({ 'labelTitle': new SimpleChange(null, 'Label Title', true) });
      expect(component.displayLabel).toBe('Label Title');
    });

    test('should labelText set displayLabel set to labelText', () => {
      component.ngOnChanges({ 'labelText': new SimpleChange(null, 'Label Text', true) });
      expect(component.displayLabel).toBe('Label Text');
    });
  });

  describe('small device - xs', () => {
    let fixture: ComponentFixture<LabelInputComponent>;
    let component: LabelInputComponent;
    let element: HTMLElement;

    let mediaObserverStub = {
      media$: of({ mqAlias: 'xs' })
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [LabelInputComponent],
        providers: [
          { provide: MediaObserver, useValue: mediaObserverStub }
        ]
      }).compileComponents();
    });

    beforeEach(async() => {
      fixture = TestBed.createComponent(LabelInputComponent);
      fixture.detectChanges(); // calls ngOnInit()
      await fixture.whenStable(); // waits for promises to complete
      fixture.detectChanges();

      component = fixture.componentInstance;
    });

    afterEach(() => {
      jest.clearAllMocks();  // reset spyOn after each test
      fixture.destroy();
      component = null;
    });

    test('should be in xs format', () => {
      expect((<any>component).xsDevice).toBeTruthy();
    });

    test('should labelAlign be calling setAddLabelClass and set addLabelClass to label-align-bottom', () => {
      const setAddLabelClassSpy = jest.spyOn(<any>component, 'setAddLabelClass');
      component.ngOnChanges({ 'labelAlign': new SimpleChange(null, 'Top', true) });
      expect(setAddLabelClassSpy).toHaveBeenCalled();
      expect(component.addLabelClass).toBe('label-align-bottom');
    });
  });
});
