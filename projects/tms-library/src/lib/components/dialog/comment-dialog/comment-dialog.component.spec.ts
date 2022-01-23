import { Directive, ViewContainerRef, Component, ViewChild, SimpleChange } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { first } from 'rxjs/operators';
import { UxIconComponentModule } from '@eui/components';

import { CommentDialog } from '../comment-dialog/comment-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabelInputComponent } from '../../label/labelInput.component';
import { of } from 'rxjs';
import { MediaObserver } from '@angular/flex-layout';
import { TextareaWithSizeComponent } from '../../textareaWithSize/textareaWithSize.component';
import { SaveHtmlDirective } from '../../directives/savehtml.directive';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'view-container-directive',
})
class ViewContainerDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

@Component({
  selector: 'app-view-container-component',
  template: `<view-container-directive></view-container-directive>`,
})
class ViewContainerComponent {
  @ViewChild(ViewContainerDirective) childWithViewContainer: ViewContainerDirective;

  get childViewContainer() {
    return this.childWithViewContainer.viewContainerRef;
  }
}

describe('CommentDialog', () => {
  describe('CommentDialog - base component verification', () => {
    let fixture: ComponentFixture<CommentDialog>;
    let component: CommentDialog;

    let mediaObserverStub = {
      media$: of({ mqAlias: 'lg' })
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule,
          BrowserAnimationsModule,
          MatDialogModule,
          UxIconComponentModule
        ],
        declarations: [CommentDialog, LabelInputComponent, TextareaWithSizeComponent],
        providers: [
          { provide: MediaObserver, useValue: mediaObserverStub },
          { provide: MatDialogRef, useValue: { close: jest.fn() } }
        ]
      }).compileComponents();
    });

    beforeEach(async() => {
      fixture = TestBed.createComponent(CommentDialog);
      fixture.detectChanges(); // calls ngOnInit()
      await fixture.whenStable(); // waits for promises to complete
      fixture.detectChanges();

      component = fixture.componentInstance;
      component.ngOnInit();
    });

    afterEach(() => {
      jest.clearAllMocks();  // reset spyOn after each test
      fixture.destroy();
      component = null;
    });

    test('should be create', () => {
      expect(component).toBeTruthy();
    });

    test('should trigger dialog close button', () => {
      const dialogRefCloseSpy = jest.spyOn(component.dialogRef, 'close');
      const element = fixture.debugElement.queryAll(By.css('ux-a-icon'));
      element[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(dialogRefCloseSpy).toHaveBeenCalledWith(undefined);
    });

    test('should trigger cancel button', () => {
      const dialogRefCloseSpy = jest.spyOn(component.dialogRef, 'close');
      const element = fixture.debugElement.queryAll(By.css('button'));
      element[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(dialogRefCloseSpy).toHaveBeenCalledWith(undefined);
    });

    test('should trigger ok button', () => {
      const dialogRefCloseSpy = jest.spyOn(component.dialogRef, 'close');
      const element = fixture.debugElement.queryAll(By.css('button'));
      element[1].triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(dialogRefCloseSpy).toHaveBeenCalledWith('');
    });

    test('should trigger trigger updateValidation twice - required & size', () => {
      const updateValidationSpy = jest.spyOn(<any>component, 'updateValidation');
      component.ngOnChanges({ 'size': new SimpleChange(null, 80, true) });
      component.ngOnChanges({ 'required': new SimpleChange(null, true, true) });
      fixture.detectChanges();
      expect(updateValidationSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('CommentDialog - input verification', () => {
    let dialog: MatDialog;
    let overlayContainerElement: HTMLElement;

    let mediaObserverStub = {
      media$: of({ mqAlias: 'lg' })
    };

    let testViewContainerRef: ViewContainerRef;
    let viewContainerFixture: ComponentFixture<ViewContainerComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule,
          BrowserAnimationsModule,
          MatDialogModule,
          UxIconComponentModule
        ],
        declarations: [
          ViewContainerComponent,
          ViewContainerDirective,
          CommentDialog,
          LabelInputComponent,
          TextareaWithSizeComponent,
          SaveHtmlDirective
        ],
        providers: [
          { provide: MediaObserver, useValue: mediaObserverStub },
          { provide: OverlayContainer, useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          }},
        ]
      });

      TestBed.overrideModule(BrowserDynamicTestingModule, {
        // not sure why I needed this, but error message told me to include it
        set: {
          entryComponents: [CommentDialog],
        },
      });

      TestBed.compileComponents();
    }));

    beforeEach(() => {
      viewContainerFixture = TestBed.createComponent(ViewContainerComponent);
      viewContainerFixture.detectChanges();
      testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
    });

    beforeEach(inject([MatDialog], (d: MatDialog) => {
      dialog = d;
    }));

    describe('testing inputs', () => {
      let dialogRef: MatDialogRef<CommentDialog, any>;

      beforeEach(() => {
        dialogRef = dialog.open(CommentDialog, {
          viewContainerRef: testViewContainerRef,
          data: {
            // DialogData goes here
          }});
      });

      test('should comment dialog message with default values', async () => {
        dialogRef.afterClosed().pipe(first()).subscribe(dialogResult => {
          expect(dialogResult).toEqual('');
        });

        await viewContainerFixture.whenStable(); // waits for promises to complete
        viewContainerFixture.detectChanges();
        const modelTitle = viewContainerFixture.debugElement.queryAll(By.css('.modal-title'))[0].nativeElement;
        expect(modelTitle.innerHTML).toBe('Comment');
        const cancelBtn = viewContainerFixture.debugElement.queryAll(By.css('button'))[0].nativeElement;
        expect(cancelBtn.innerHTML).toBe('Cancel');
        const okBtn = viewContainerFixture.debugElement.queryAll(By.css('button'))[1].nativeElement;
        expect(okBtn.innerHTML).toBe('Ok');
        // Close dialog with cancel button
        const element = viewContainerFixture.debugElement.queryAll(By.css('button'));
        element[1].triggerEventHandler('click', {});
        viewContainerFixture.detectChanges();
      });

      test(`should comment dialog message with message to CommentDialog, caption to MyCaption, captionOkBtn to MyOK,
          captionCancelBtn to MyCancel`, async () => {
        dialogRef.componentInstance.additionalMessage = 'AdditionalCommentMessage';
        dialogRef.componentInstance.caption = 'MyCaption';
        dialogRef.componentInstance.captionOkBtn = 'MyOK';
        dialogRef.componentInstance.captionCancelBtn = 'MyCancel';
        dialogRef.afterClosed().pipe(first()).subscribe(dialogResult => {
          expect(dialogResult).toBeUndefined();
        });

        await viewContainerFixture.whenStable(); // waits for promises to complete
        viewContainerFixture.detectChanges();
        const modelTitle = viewContainerFixture.debugElement.queryAll(By.css('.modal-title'))[0].nativeElement;
        expect(modelTitle.innerHTML).toBe('MyCaption');
        const additionalMessage = viewContainerFixture.debugElement.queryAll(By.css('.label'))[0].nativeElement;
        expect(additionalMessage.attributes[1].value).toBe('AdditionalCommentMessage');
        const cancelBtn = viewContainerFixture.debugElement.queryAll(By.css('button'))[0].nativeElement;
        expect(cancelBtn.innerHTML).toBe('MyCancel');
        const okBtn = viewContainerFixture.debugElement.queryAll(By.css('button'))[1].nativeElement;
        expect(okBtn.innerHTML).toBe('MyOK');
        // Close dialog with cancel button
        const element = viewContainerFixture.debugElement.queryAll(By.css('button'));
        element[0].triggerEventHandler('click', {});
        viewContainerFixture.detectChanges();
      });

      test('should make comment required and return CommentValue', async () => {
        dialogRef.componentInstance.required = true;
        // subscribe to return value
        dialogRef.afterClosed().pipe(first()).subscribe(dialogResult => {
          expect(dialogResult).toBe('CommentValue');
        });

        await viewContainerFixture.whenStable(); // waits for promises to complete
        viewContainerFixture.detectChanges();
        const buttons = viewContainerFixture.debugElement.queryAll(By.css('button'));
        expect(buttons[1].nativeElement.hasAttribute('disabled')).toBeTruthy();
        const textarea = viewContainerFixture.debugElement.queryAll(By.css('textarea'))[0].nativeElement;
        textarea.value = 'CommentValue';
        textarea.dispatchEvent(new Event('input'));
        viewContainerFixture.detectChanges();
        expect(buttons[1].nativeElement.hasAttribute('disabled')).toBeFalsy();
        buttons[1].triggerEventHandler('click', {});
        viewContainerFixture.detectChanges();
      });
    });
  });
});
