import { Directive, ViewContainerRef, Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { first } from 'rxjs/operators';
import { UxIconComponentModule } from '@eui/components';

import { LoadingService } from '../../../services/loading.service';
import { enMessageDialog, MessageDialog } from './messagedialog.component';

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

describe('MessageDialog', () => {
  describe('MessageDialog - base component verification', () => {
    let fixture: ComponentFixture<MessageDialog>;
    let component: MessageDialog;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          BrowserAnimationsModule,
          MatDialogModule,
          UxIconComponentModule
        ],
        declarations: [MessageDialog],
        providers: [
          LoadingService,
          { provide: MatDialogRef, useValue: { close: jest.fn() } }
        ]
      }).compileComponents();
    });

    beforeEach(async() => {
      fixture = TestBed.createComponent(MessageDialog);
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

    test('should be create', () => {
      expect(component).toBeTruthy();
    });

    test('should trigger dialog close button', () => {
      const dialogRefCloseSpy = jest.spyOn(component.dialogRef, 'close');
      const element = fixture.debugElement.queryAll(By.css('ux-a-icon'));
      element[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(dialogRefCloseSpy).toHaveBeenCalledWith(false);
    });

    test('should trigger cancel button', () => {
      const dialogRefCloseSpy = jest.spyOn(component.dialogRef, 'close');
      const element = fixture.debugElement.queryAll(By.css('button'));
      element[0].triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(dialogRefCloseSpy).toHaveBeenCalledWith(false);
    });

    test('should trigger ok button', () => {
      const dialogRefCloseSpy = jest.spyOn(component.dialogRef, 'close');
      const element = fixture.debugElement.queryAll(By.css('button'));
      element[1].triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(dialogRefCloseSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('MessageDialog - input verification', () => {
    let dialog: MatDialog;
    let overlayContainerElement: HTMLElement;

    let testViewContainerRef: ViewContainerRef;
    let viewContainerFixture: ComponentFixture<ViewContainerComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          ViewContainerComponent,
          ViewContainerDirective,
          MessageDialog
        ],
        imports: [
          BrowserAnimationsModule,
          MatDialogModule,
          UxIconComponentModule
        ],
        providers: [
          LoadingService,
          { provide: OverlayContainer, useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          }},
        ],
      });

      TestBed.overrideModule(BrowserDynamicTestingModule, {
        // not sure why I needed this, but error message told me to include it
        set: {
          entryComponents: [MessageDialog],
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

    describe('Save and Cancel', () => {
      let dialogRef: MatDialogRef<MessageDialog, any>;

      beforeEach(() => {
        dialogRef = dialog.open(MessageDialog, {
          viewContainerRef: testViewContainerRef,
          data: {
            // DialogData goes here
          }});
      });

      test('should accept dialog message with default values', async () => {
        dialogRef.afterClosed().pipe(first()).subscribe(dialogResult => {
          expect(dialogResult).toBeTruthy();
        });

        await viewContainerFixture.whenStable(); // waits for promises to complete
        viewContainerFixture.detectChanges();
        const modelTitle = viewContainerFixture.debugElement.queryAll(By.css('.modal-title'))[0].nativeElement;
        expect(modelTitle.innerHTML).toBe('Confirm');
        const paragraphMessage = viewContainerFixture.debugElement.queryAll(By.css('p'))[0].nativeElement;
        expect(paragraphMessage.innerHTML).toBe('');
        const cancelBtn = viewContainerFixture.debugElement.queryAll(By.css('button'))[0].nativeElement;
        expect(cancelBtn.innerHTML).toBe('No');
        const okBtn = viewContainerFixture.debugElement.queryAll(By.css('button'))[1].nativeElement;
        expect(okBtn.innerHTML).toBe('Yes');
        // Close dialog with cancel button
        const element = viewContainerFixture.debugElement.queryAll(By.css('button'));
        element[1].triggerEventHandler('click', {});
        viewContainerFixture.detectChanges();
      });

      test('should accept dialog message with message to MessageDialog, caption to MyCaption, captionOkBtn to MyYes, captionCancelBtn to MyNo', async () => {
        dialogRef.componentInstance.message = 'MessageDialog';
        dialogRef.componentInstance.caption = 'MyCaption';
        dialogRef.componentInstance.captionOkBtn = 'MyYes';
        dialogRef.componentInstance.captionCancelBtn = 'MyNo';
        dialogRef.afterClosed().pipe(first()).subscribe(dialogResult => {
          expect(dialogResult).toBeFalsy();
        });

        await viewContainerFixture.whenStable(); // waits for promises to complete
        viewContainerFixture.detectChanges();
        const modelTitle = viewContainerFixture.debugElement.queryAll(By.css('.modal-title'))[0].nativeElement;
        expect(modelTitle.innerHTML).toBe('MyCaption');
        const paragraphMessage = viewContainerFixture.debugElement.queryAll(By.css('p'))[0].nativeElement;
        expect(paragraphMessage.innerHTML).toBe('MessageDialog');
        const cancelBtn = viewContainerFixture.debugElement.queryAll(By.css('button'))[0].nativeElement;
        expect(cancelBtn.innerHTML).toBe('MyNo');
        const okBtn = viewContainerFixture.debugElement.queryAll(By.css('button'))[1].nativeElement;
        expect(okBtn.innerHTML).toBe('MyYes');
        // Close dialog with cancel button
        const element = viewContainerFixture.debugElement.queryAll(By.css('button'));
        element[0].triggerEventHandler('click', {});
        viewContainerFixture.detectChanges();
      });

      test('should info dialog message with default values', async () => {
        dialogRef.componentInstance.messageType = enMessageDialog.info;
        // subscribe to return value
        dialogRef.afterClosed().pipe(first()).subscribe(dialogResult => {
          expect(dialogResult).toBeTruthy();
        });

        await viewContainerFixture.whenStable(); // waits for promises to complete
        viewContainerFixture.detectChanges();
        const element = viewContainerFixture.debugElement.queryAll(By.css('button'));
        expect(element[0].nativeElement.hidden).toBeTruthy();
        element[1].triggerEventHandler('click', {});
        viewContainerFixture.detectChanges();
      });
    });
  });
});
