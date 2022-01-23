import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, SimpleChange, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import '../objectExtensions';
import { TextareaWithSizeComponent } from './textareaWithSize.component';

@Component({
  template: `<textarea-with-size type="text" [formControl]="valueControl"></textarea-with-size>`
})
class TestTextareaWithSizeComponent {
  @ViewChild(TextareaWithSizeComponent)
  public textareaWithSizeComponent: TextareaWithSizeComponent;

  public valueControl: FormControl = new FormControl({ value: null, disabled: false });
}

describe('TextareaWithSizeComponent', () => {
  describe('TextareaWithSizeComponent - input verifications', () => {
    let fixture: ComponentFixture<TextareaWithSizeComponent>;
    let component: TextareaWithSizeComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          FormsModule
        ],
        declarations: [TextareaWithSizeComponent]
      }).compileComponents();
    });

    beforeEach(async() => {
      fixture = TestBed.createComponent(TextareaWithSizeComponent);
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

    test('should be created', () => {
      expect(component).toBeTruthy();
    });

    test('should set the class to yellow', () => {
      component.ngOnChanges({ 'class': new SimpleChange(null, 'yellow', true) });
      fixture.detectChanges();
      const element = fixture.debugElement.queryAll(By.css('div'));
      expect((element[0].nativeElement as HTMLDivElement).getAttribute('class')).toEqual('yellow');
    });

    test('should set the autosize to true', () => {
      component.ngOnChanges({ 'autosize': new SimpleChange(null, true, true) });
      fixture.detectChanges();
      const element = fixture.debugElement.queryAll(By.css('textArea'));
      expect(element[0].nativeElement.style.overflow).toEqual('hidden');
    });

    test('should set the height to 200px', () => {
      component.ngOnChanges({ 'height': new SimpleChange(null, '200px', true) });
      fixture.detectChanges();
      const element = fixture.debugElement.queryAll(By.css('textArea'));
      expect(element[0].nativeElement.style['overflow-y']).toEqual('auto');
      expect(element[0].nativeElement.style.height).toEqual('200px');
    });

    test('should show the size info', () => {
      const element = fixture.debugElement.queryAll(By.css('.size-info'));
      expect(element[0].nativeElement.hidden).toBeTruthy();
      component.ngOnChanges({ 'showSizeInfo': new SimpleChange(null, true, true) });
      fixture.detectChanges();
      expect(element[0].nativeElement.hidden).toBeFalsy();
    });

    test('should set maxBytes to 400, text value to TestValue and retest result', () => {
      const element = fixture.debugElement.queryAll(By.css('.size-info'));
      component.ngOnChanges({ 'showSizeInfo': new SimpleChange(null, true, true) });
      component.ngOnChanges({ 'maxBytes': new SimpleChange(null, 400, true) });
      fixture.detectChanges();
      expect(component.sizeInfo).toBe('0/400');
      component.writeValue('TestValue');
      fixture.detectChanges();
      expect(component.sizeInfo).toBe('9/400');
    });

    test('should trigger blur event', () => {
      const onTouchedCallbackSpy = jest.spyOn(<any>component, 'onTouchedCallback');
      const element = fixture.debugElement.queryAll(By.css('textarea'));
      element[0].triggerEventHandler('blur', {});
      fixture.detectChanges();
      expect(onTouchedCallbackSpy).toHaveBeenCalled();
    });

    test('should trigger window resize event', () => {
      const adjustSpy = jest.spyOn(<any>component, 'adjust');
      window.dispatchEvent(new Event('resize'));
      expect(adjustSpy).toHaveBeenCalled();
    });

    test('should update input value to TestValue', () => {
      const onChangeCallbackSpy = jest.spyOn(<any>component, 'onChangeCallback');
      component.ngOnChanges({ 'showSizeInfo': new SimpleChange(null, true, true) });
      component.ngOnChanges({ 'maxBytes': new SimpleChange(null, 5, true) });
      fixture.detectChanges();
      const element = fixture.debugElement.queryAll(By.css('textarea'))[0].nativeElement;
      element.value = 'TestValue';
      element.dispatchEvent(new Event('input'));
      expect((component as any).innerValue).toBe('TestValue');
      fixture.detectChanges();
      expect(onChangeCallbackSpy).toHaveBeenCalledTimes(1);
      expect(component.sizeInfo).toBe('9/5');
    });
  });

  describe('TextareaWithSizeComponent - formControl verification', () => {
    let fixture: ComponentFixture<TestTextareaWithSizeComponent>;
    let component: TestTextareaWithSizeComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule
        ],
        declarations: [TextareaWithSizeComponent, TestTextareaWithSizeComponent]
      }).compileComponents();
    });

    beforeEach(async() => {
      fixture = TestBed.createComponent(TestTextareaWithSizeComponent);
      fixture.detectChanges(); // calls ngOnInit()
      await fixture.whenStable(); // waits for promises to complete
      fixture.detectChanges();

      component = fixture.componentInstance;
    });

    afterEach(() => {
      fixture.destroy();
      component = null;
    });

    test('should set value and disable component', async () => {
      component.valueControl.setValue('TestValue');
      component.valueControl.disable();
      component.valueControl.updateValueAndValidity();
      await fixture.whenStable(); // waits for promises to complete
      fixture.detectChanges();
      const element = fixture.debugElement.queryAll(By.css('textarea'));
      expect(component.textareaWithSizeComponent.value).toBe('TestValue');
      expect(element[0].nativeElement.hasAttribute('disabled')).toBeTruthy();
    });
  });
});
