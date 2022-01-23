import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Subscription, Subject, Observable, fromEvent, of } from 'rxjs';
import { catchError, throttleTime } from 'rxjs/operators';
import { UxAppShellService } from '@eui/core';

import { ICanDeactivateGuard } from '../../services/candeactivate.guard';
import { RequestResult } from '../../services/base.service';
import { enMessageDialog, MessageDialog } from '../dialog/message-dialog/messagedialog.component';
import { CommentDialog } from '../dialog/comment-dialog/comment-dialog.component';
import { GridStateStore } from '../aggrid/gridState.Store';
import { UxTMSListItemsComponent } from '../list/list.component';
import { GeneralRoutines } from '../generalRoutines';

export enum enAlert {
  success = 1,
  info = 2,
  warning = 3,
  danger = 4
}

@Component({ template: '' })
export abstract class BaseMessageComponent implements OnDestroy {
  public loading: boolean = false;
  protected messageDialogRef: MatDialogRef<MessageDialog>;
  protected commentDialogRef: MatDialogRef<CommentDialog>;

  // private errorLogService: ErrorLogService;

  protected constructor(public dialog: MatDialog, public uxAppShellService: UxAppShellService) {
/*    let resolvedProviders = ReflectiveInjector.resolve([ErrorLogService]);
    let childInjector = ReflectiveInjector.fromResolvedProviders(resolvedProviders);
    this.errorLogService = childInjector.get(ErrorLogService);*/
  }

  ngOnDestroy() {
    this.messageDialogRef = null;
    this.commentDialogRef = null;
  }

  /**
   * Display alert message to the user
   * @param message - message to display
   * @param alertdisplaytype - Alert type: success = 0, info = 1, warning = 2, danger = 3
   * @param life - duration in seconds, if not avalable message will not be hidden
   * @param closeable - if message can be closed or not via a close button
   */
  protected showAlert(message: string, alertdisplaytype: enAlert, life?: number, closeable?: boolean) {
    let isSticky = alertdisplaytype === enAlert.danger || (alertdisplaytype === enAlert.warning && life === undefined);
    this.uxAppShellService.growl({ severity: enAlert[alertdisplaytype], summary: '', detail: message }, isSticky , true, life ? life * 1000 : undefined);
    // // Report danger alerts to the backend
    // if (alertdisplaytype === enAlert.danger) {
    //   this.errorLogService.logAngularToServer(message);
    // }
  }

  protected messageDialog(message: string, messageType?: enMessageDialog, caption?: string, captionOkBtn?: string,
                          captionCancelBtn?: string, closeValueUndefined?: boolean): Observable<boolean> {
    // 1. Create dialog
    this.messageDialogRef = this.dialog.open(MessageDialog, {
      disableClose: false
    });
    // 2. Assign parameters
    this.messageDialogRef.componentInstance.message = message;
    if (messageType) { this.messageDialogRef.componentInstance.messageType = messageType; }
    if (caption) { this.messageDialogRef.componentInstance.caption = caption; }
    if (captionOkBtn) { this.messageDialogRef.componentInstance.captionOkBtn = captionOkBtn; }
    if (captionCancelBtn) { this.messageDialogRef.componentInstance.captionCancelBtn = captionCancelBtn; }
    if (closeValueUndefined) { this.messageDialogRef.componentInstance.closeValueUndefined = closeValueUndefined; }
    // 3. subscribe to return value
    return this.messageDialogRef.afterClosed();
  }

  protected commentDialog(caption: string = 'Comment', size: number = 200, captionOkBtn: string = 'Ok',
                          captionCancelBtn: string = 'Cancel', required: boolean = false,
                          additionalMessage: string = '', warningMessage: string = '', labelText: string = 'Comment'): Observable<string> {
    // 1. Create dialog
    this.commentDialogRef = this.dialog.open(CommentDialog, {
      disableClose: false
    });
    // 2. Assign parameters
    if (caption !== undefined) { this.commentDialogRef.componentInstance.caption = caption; }
    if (size !== undefined) { this.commentDialogRef.componentInstance.size = size; }
    if (captionOkBtn !== undefined) { this.commentDialogRef.componentInstance.captionOkBtn = captionOkBtn; }
    if (captionCancelBtn !== undefined) { this.commentDialogRef.componentInstance.captionCancelBtn = captionCancelBtn; }
    if (required !== undefined) { this.commentDialogRef.componentInstance.required = required; }
    if (additionalMessage !== undefined) { this.commentDialogRef.componentInstance.additionalMessage = additionalMessage; }
    if (warningMessage !== undefined) { this.commentDialogRef.componentInstance.warningMessage = warningMessage; }
    if (labelText !== undefined) { this.commentDialogRef.componentInstance.labelText = labelText; }
    // 3. subscribe to return value
    return this.commentDialogRef.afterClosed();
  }

  protected processResponseMsg(responseData: RequestResult, defaultErrorMessage: string, defaultSuccessMessage: string = '',
                               showAsMessageDialog: boolean = false, messageDialogCaption: string = ''): boolean {
    if (responseData.result === true) {
      responseData.message = GeneralRoutines.hasValue(responseData.message) ? responseData.message : defaultSuccessMessage;
      if (responseData.message && responseData.messageType) {
        let duration = undefined;
        if (responseData.messageType === enAlert.success) {
          duration = 10;
        }

        if (showAsMessageDialog === true) {
          this.messageDialog(responseData.message, enMessageDialog.info, messageDialogCaption, 'Ok');
        } else {
          this.showAlert(responseData.message, responseData.messageType, duration);
        }
      }
    } else {
      // Compose message
      let message = defaultErrorMessage;

      message = GeneralRoutines.hasValue(responseData.message) ? (GeneralRoutines.hasValue(message) ? message + ' - ' : '') + responseData.message : message;
      this.showAlert(message, enAlert.danger);
    }

    return responseData.result;
  }
}

@Component({ template: '' })
export abstract class BaseResizeComponent extends BaseMessageComponent implements OnDestroy, AfterViewInit {
  private windowResize$: Subscription;
  public isPrinting: boolean = false;
  public readOnlyMode: boolean = false;

  protected constructor(private ngzone: NgZone, dialog: MatDialog, uxAppShellService: UxAppShellService) {
    super(dialog, uxAppShellService);
  }

  abstract windowResize(): void;

  ngAfterViewInit() {
    this.ngzone.runOutsideAngular( () =>
      this.windowResize$ = fromEvent(window, 'resize').pipe(
        throttleTime(300)
      ).subscribe(() => this.windowResize())
    );
    this.fireWindowResize();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.windowResize$) {
      this.windowResize$.unsubscribe();
    }
  }

  public fireWindowResize(): void {
    setTimeout(() => {
      let event = document.createEvent('HTMLEvents');
      event.initEvent('resize', true, false);
      window.dispatchEvent(event);
    }, 250);
  }
}

@Component({ template: '' })
export abstract class BaseListComponent extends BaseResizeComponent implements OnDestroy {
  public aggridHeight: number;

  abstract gridState: GridStateStore;
  abstract makeRequest$: Subject<any>;
  abstract header: ElementRef;
  abstract listgrid: UxTMSListItemsComponent;

  protected constructor(ngzone: NgZone, dialog: MatDialog, public cdr: ChangeDetectorRef,
                        uxAppShellService: UxAppShellService) {
    super(ngzone, dialog, uxAppShellService);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.makeRequest$.unsubscribe();
    this.gridState.store();
  }

  public windowResize(): void {
    if (this.header !== undefined && this.listgrid !== undefined) {
      this.listgrid.height = window.innerHeight - (this.header.nativeElement.offsetTop + this.header.nativeElement.offsetHeight) - 15;
      this.aggridHeight = window.innerHeight - (this.header.nativeElement.offsetTop + this.header.nativeElement.offsetHeight) - 15;
      this.cdr.detectChanges();
    }
  }

  public isMaxRowSizeExceeded(maxRows: Number): boolean {
    if (this.gridState.totalRows >= maxRows) {
      this.messageDialog('Maximum allowed rows to extract is limited to ' + maxRows + '.  Please refine your filter.',
        enMessageDialog.info, 'Print', 'OK');
      return true;
    } else { return false; }
  }

  protected refreshData(pagenumber: number, pagesize: number): void {
    if (this.gridState.gridOptions.api) { this.gridState.gridOptions.api.showLoadingOverlay(); }
    this.makeRequest$.next();
  }

  // tslint:disable-next-line
  protected loadData<T>(TCreator: { new (): T; }, myFunc: Observable<T>, generalErrMsg: string): Observable<T> {
    const disposableStream$ = myFunc;
    return disposableStream$.pipe(
      catchError(errMsg => {
        this.showAlert(generalErrMsg + (errMsg.message ? errMsg.message : errMsg), enAlert.danger);
        return of(new TCreator());
      })
    );
  }
}

@Component({ template: '' })
export abstract class BaseDetailComponent extends BaseResizeComponent implements OnDestroy, ICanDeactivateGuard {
  public pageTitle: string = 'Page title';
  public detailHeight: number;
  public submitting: boolean = false;

  // keeps track of the initial values. During the form build you initialise this property.
  // Use the function resetDetailForm to reset the values to the initial state
  private initialValues: any;

  abstract detailForm: FormGroup;
  abstract header: ElementRef;

  protected constructor(ngzone: NgZone, dialog: MatDialog, public cdr: ChangeDetectorRef,
                        uxAppShellService: UxAppShellService) {
    super(ngzone, dialog, uxAppShellService);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  /**
   * Function used by the Guard to verify if page can be exited without loosing changes
   * @returns
   */
  public canDeactivate(): Observable<boolean> {
    if (this.detailForm && this.detailForm.dirty === true) {
      return this.messageDialog('Changes will be lost. Continue?');
    } else { return of(true); }
  }

  public windowResize(): void {
    if (this.header !== undefined) {
      // -15 as spacing on the bottom
      this.detailHeight = window.innerHeight - (this.header.nativeElement.offsetTop + this.header.nativeElement.offsetHeight) - 15;
      this.cdr.detectChanges();
    }
  }

  /**
   * set initialValues which can be used later to reset the form to it's initial state
   */
  public setInitialValues(): void {
    this.initialValues = this.detailForm.getRawValue();
  }

  /**
   * reset the form back to the initial state with the initial values
   */
  public resetDetailForm(): void {
    if (this.initialValues !== undefined) {
      this.detailForm.reset(this.initialValues);
    }
  }
}
