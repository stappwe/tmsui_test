import { MatDialog, MatDialogModule, MatDialogState } from '@angular/material/dialog';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChangeDetectorRef, Component, ElementRef, HostListener, InjectionToken, NgZone, OnInit, ViewChild } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { Observable, of, Subject, Subscription, throwError } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import { StoreModule, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { UxAppShellService, CoreState, localStorageSync, translateConfig, reducers as coreReducers,
  CoreModule as EuiCoreModule, EUI_CONFIG_TOKEN } from '@eui/core';
import { UxIconComponentModule, UxListItemComponentModule } from '@eui/components';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular';

import { BaseDetailComponent, BaseListComponent, BaseMessageComponent, BaseResizeComponent, enAlert } from './baseClasses';
import { enMessageDialog, MessageDialog } from '../dialog/message-dialog/messagedialog.component';
import { CommentDialog } from '../dialog/comment-dialog/comment-dialog.component';
import { LoadingService } from '../../services/loading.service';
import { LabelInputComponent } from '../label/labelInput.component';
import { TextareaWithSizeComponent } from '../textareaWithSize/textareaWithSize.component';

import '../objectExtensions';
import { GridStateStore } from '../aggrid/gridState.Store';
import { UxTMSListItemsComponent } from '../list/list.component';
import { RefreshData } from '../../services/base.service';

/* tslint:disable-next-line */
export interface AppState extends CoreState {
  // [key: string]: fromTaskManager.State | any;
}

const rootReducer = Object.assign({}, coreReducers, {
  // [fromTaskManager.namespace]: fromTaskManager.reducers,
});

export function getReducers() {
  return rootReducer;
}

export const REDUCER_TOKEN = new InjectionToken<any>('Registered Reducers');
export const metaReducers: MetaReducer<AppState>[] = [localStorageSync, storeFreeze];

class MyBaseMessageComponent extends BaseMessageComponent {
  constructor(public dialog: MatDialog, public uxAppShellService: UxAppShellService) {
    super(dialog, uxAppShellService);
  }
}

class MyBaseResizeComponent extends BaseResizeComponent {
  constructor(ngzone: NgZone, public dialog: MatDialog, public uxAppShellService: UxAppShellService) {
    super(ngzone, dialog, uxAppShellService);
  }

  public windowResize(): void {
    // do nothing
  }
}

@Component({ template: `
    <div class="container-fluid">
      <div #header>
      </div>
      <div #agGrid fxLayout="row" fxShow fxShow.xs="false" fxShow.print="true" [style.height.px]="aggridHeight">
        <ag-grid-angular style="height: 100%; width: 100%;" class="ag-theme-fresh"
                         [gridOptions]="gridState.gridOptions"

                         rowHeight="22"
                         rowSelection="single"

                         (selectionChanged)="gridState.onGridSelectionChanged($event)"
                         (gridReady)="gridState.onGridReady(agGrid)"
                         (gridSizeChanged)="gridState.onGridResize(agGrid)">
        </ag-grid-angular>
      </div>
      <ux-tms-list-items #listgrid fxHide fxShow.xs="true" fxHide.print="true" rowSelection="single">
        <ux-list-item *ngFor="let rowItem of gridState.rowData" [item]="rowItem">
          <uxListItemSubLabel>
            <div class="m-2">
              {{rowItem.columnId}}
            </div>
          </uxListItemSubLabel>
        </ux-list-item>
      </ux-tms-list-items>
    </div>
  ` })
class MyBaseListComponent extends BaseListComponent {
  @ViewChild('header', { static: false }) header: ElementRef;
  @ViewChild('listgrid', { static: false }) listgrid: UxTMSListItemsComponent;

  // grid settings
  public gridState: GridStateStore; // = { store: jest.fn() } ;
  public makeRequest$: Subject<any> = new Subject();

  public dataService: any = {
    getData: jest.fn().mockReturnValueOnce(of({ rows : [{ columnId: 1 }, { columnId: 2 }], rowCount: 2 }))
      // .mockReturnValueOnce(of({ rows : [{ columnId: 1 }, { columnId: 2 }], rowCount: 2 }))
      .mockReturnValueOnce(throwError('trace error logging'))
  };

  constructor(ngzone: NgZone, dialog: MatDialog, cdr: ChangeDetectorRef,
              uxAppShellService: UxAppShellService) {
    super(ngzone, dialog, cdr, uxAppShellService);
    // setup grid and list component + state storage
    this.gridState = new GridStateStore('testBaseClass', this.createColumnDefs(), this.refreshData.bind(this));

    this.gridState.gridOptions.context = { parent: this };
    // Construct the refresh observable to prevent overwriting older requests
    this.makeRequest$.pipe(
      switchMap((searchQuery: any) => {
        return this.loadData<RefreshData>(RefreshData, this.dataService.getData(searchQuery), 'Data list loading failed - ');
      })
    ).subscribe(
      (data: any) => {
        this.gridState.setData(data.rows, data.rowCount);
      }
    );
  }

  private createColumnDefs(): Array<any> {
    let columnDefs = [
      {
        headerName: 'ID', hide: true, field: 'columnId', orderID: 1, queryParam: 'columnId'
      }
    ];

    return columnDefs;
  }
}

@Component({ template: `
    <form role="form" [formGroup]="detailForm" *ngIf="(detailForm !== undefined)">
      <div #header>
        <div class="btn-toolbar btn-toolbar-menu" fxLayout="row" fxLayoutAlign="end" fxLayoutGap="5px"
             fxHide.print="true" role="toolbar" aria-label="any toolbar">
        </div>
      </div>
      <div class="detail print-layout" [style.height.px]="detailHeight">
        <input type="number" class="form-control col-sm-12" formControlName="columnId">
      </div>
    </form>
  ` })
class MyBaseDetailComponent extends BaseDetailComponent implements OnInit {
  @ViewChild('header', { static: false }) header: ElementRef;

  public detailForm: FormGroup;

  public details: { columnId: number } = { columnId: 10 };

  constructor(private formBuilder: FormBuilder, ngzone: NgZone, cdr: ChangeDetectorRef,
              dialog: MatDialog, uxAppShellService: UxAppShellService) {
    super(ngzone, dialog, cdr, uxAppShellService);
  }

  ngOnInit() {
    this.buildForm();
  }

  @HostListener('window:beforeunload')
  public canDeactivate(): Observable<boolean> {
    return super.canDeactivate();
  }

  private buildForm(): void {
    if (this.details !== undefined) {
      // 1. Build form
      this.detailForm = this.formBuilder.group({
        columnId: [this.details.columnId, Validators.required]
      });
    }
  }
}

describe('Base Classes', () => {
  describe('BaseMessageComponent', () => {
    let fixture: ComponentFixture<MyBaseMessageComponent>;
    let component: MyBaseMessageComponent;
    let overlayContainerElement: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule,
          BrowserAnimationsModule,
          UxIconComponentModule,
          MatDialogModule,
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([]),
          StoreModule.forRoot(REDUCER_TOKEN, { metaReducers })
        ],
        declarations: [MessageDialog, CommentDialog, LabelInputComponent, TextareaWithSizeComponent, MyBaseMessageComponent],
        providers: [
          LoadingService,
          UxAppShellService,
          {
            provide: REDUCER_TOKEN,
            deps: [],
            useFactory: getReducers
          }
        ]
      }).compileComponents();
    });

    beforeEach(async() => {
      fixture = TestBed.createComponent(MyBaseMessageComponent);
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

    test('should show alert box', () => {
      const growlSpy = jest.spyOn(component.uxAppShellService, 'growl');
      (component as any).showAlert('Alert box', enAlert.success);

      fixture.detectChanges();
      expect(component.uxAppShellService.isGrowlSticky).toBeFalsy();
      expect(growlSpy).toHaveBeenCalled();
    });

    test('should show MessageDialog', () => {
      (component as any).messageDialog('Message box', enMessageDialog.accept).pipe(first()).subscribe(result => {
        expect(result).toBeTruthy();
      });

      fixture.detectChanges();
      expect((component as any).messageDialogRef.getState()).toBe(MatDialogState.OPEN);
      (component as any).messageDialogRef.close(true);
      fixture.detectChanges();
      expect((component as any).messageDialogRef.getState()).toBe(MatDialogState.CLOSING);
    });

    test('should show CommonDialog', () => {
      (component as any).commentDialog('Comment box', enMessageDialog.accept).pipe(first()).subscribe(result => {
        expect(result).toBeFalsy();
      });

      fixture.detectChanges();
      expect((component as any).commentDialogRef.getState()).toBe(MatDialogState.OPEN);
      (component as any).commentDialogRef.close(false);
      fixture.detectChanges();
      expect((component as any).commentDialogRef.getState()).toBe(MatDialogState.CLOSING);
    });

    test('should handle processResponseMsg - Success as messageDialog', () => {
      const data = {
        'result': true,
        'message': 'Successfully saved',
        'messageType': 1
      };
      const messageDialogSpy = jest.spyOn(component as any, 'messageDialog');

      expect((component as any).processResponseMsg(data, 'Error message', '', true)).toBeTruthy();

      fixture.detectChanges();
      expect(messageDialogSpy).toHaveBeenCalled();
    });

    test('should handle processResponseMsg - Success as alert', () => {
      const data = {
        'result': true,
        'message': 'Successfully saved',
        'messageType': 1
      };
      const showAlertSpy = jest.spyOn(component as any, 'showAlert');

      expect((component as any).processResponseMsg(data, 'Error message')).toBeTruthy();

      fixture.detectChanges();
      expect(showAlertSpy).toHaveBeenCalled();
    });

    test('should handle processResponseMsg - Failed', () => {
      const data = {
        'result': false,
        'message': 'Operation failed',
        'messageType': 4
      };
      const showAlertSpy = jest.spyOn(component as any, 'showAlert');

      expect((component as any).processResponseMsg(data, 'Error message')).toBeFalsy();

      fixture.detectChanges();
      expect(showAlertSpy).toHaveBeenCalled();
    });
  });

  describe('BaseResizeComponent', () => {
    let fixture: ComponentFixture<MyBaseResizeComponent>;
    let component: MyBaseResizeComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MatDialogModule],
        declarations: [MyBaseResizeComponent, BaseResizeComponent],
        providers: [
          { provide: UxAppShellService, useValue: {} }
        ]
      }).compileComponents();
    });

    beforeEach(async() => {
      fixture = TestBed.createComponent(MyBaseResizeComponent);
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

    test('should fire window resize', fakeAsync(() => {
      const windowResizeSpy = jest.spyOn(<any>component, 'windowResize');
      component.fireWindowResize();
      tick(2000);
      fixture.detectChanges();
      expect(windowResizeSpy).toHaveBeenCalled();
    }));
  });

  describe('BaseListComponent', () => {
    let fixture: ComponentFixture<MyBaseListComponent>;
    let component: MyBaseListComponent;
    let euiConfig = { appConfig: {}, environment: { apiBaseUrl: '' } };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule,
          BrowserAnimationsModule,
          HttpClientTestingModule,
          EuiCoreModule.forRoot(),
          TranslateModule.forRoot(translateConfig),
          MatDialogModule,
          AgGridModule.withComponents([]),
          UxIconComponentModule,
          UxListItemComponentModule
        ],
        declarations: [MessageDialog, MyBaseListComponent, BaseListComponent, UxTMSListItemsComponent],
        providers: [
          LoadingService,
          { provide: EUI_CONFIG_TOKEN, useValue: euiConfig },
          { provide: UxAppShellService, useValue: { growl() { console.log('growl called'); } } }
        ]
      }).compileComponents();
    });

    beforeEach(async() => {
      fixture = TestBed.createComponent(MyBaseListComponent);
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

    test('should fire window resize', fakeAsync(() => {
      const detectChangesSpy = jest.spyOn(<any>component.cdr, 'detectChanges');
      component.fireWindowResize();
      tick(2000);
      fixture.detectChanges();
      expect(detectChangesSpy).toHaveBeenCalled();
    }));

    test('should set grid data', () => {
      const gridStateSetDataSpy = jest.spyOn(<any>component.gridState, 'setData');
      component.gridState.refreshData(true);
      fixture.detectChanges();
      expect(gridStateSetDataSpy).toHaveBeenCalled();
    });

    test('should check maxRow and verify true and false', () => {
      const messageDialogSpy = jest.spyOn(<any>component, 'messageDialog');
      expect(component.isMaxRowSizeExceeded(1)).toBeTruthy();
      fixture.detectChanges();
      expect(messageDialogSpy).toHaveBeenCalled();
      expect(component.isMaxRowSizeExceeded(5)).toBeFalsy();
    });

    test('should check loadData and verify error handling', () => {
      const gridStateSetDataSpy = jest.spyOn(<any>component.gridState, 'setData');
      component.gridState.refreshData(true);
      component.gridState.refreshData(true);
      fixture.detectChanges();
      expect(gridStateSetDataSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('BaseDetailComponent', () => {
    let fixture: ComponentFixture<MyBaseDetailComponent>;
    let component: MyBaseDetailComponent;
    let euiConfig = { appConfig: {}, environment: { apiBaseUrl: '' } };
    let canDeactivateSubscription: Subscription;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          FormsModule,
          ReactiveFormsModule,
          BrowserAnimationsModule,
          EuiCoreModule.forRoot(),
          TranslateModule.forRoot(translateConfig),
          MatDialogModule,
          UxIconComponentModule
        ],
        declarations: [MessageDialog, MyBaseDetailComponent, BaseDetailComponent],
        providers: [
          LoadingService,
          { provide: EUI_CONFIG_TOKEN, useValue: euiConfig },
          { provide: UxAppShellService, useValue: { growl() { console.log('growl called'); } } }
        ]
      }).compileComponents();
    });

    beforeEach(async() => {
      fixture = TestBed.createComponent(MyBaseDetailComponent);
      fixture.detectChanges(); // calls ngOnInit()
      await fixture.whenStable(); // waits for promises to complete
      fixture.detectChanges();

      component = fixture.componentInstance;
    });

    afterEach(() => {
      jest.clearAllMocks();  // reset spyOn after each test
      fixture.destroy();
      component = null;
      if (canDeactivateSubscription) {
        canDeactivateSubscription.unsubscribe();
      }
    });

    test('should be create', () => {
      expect(component).toBeTruthy();
    });

    test('should fire window resize', fakeAsync(() => {
      const detectChangesSpy = jest.spyOn(<any>component.cdr, 'detectChanges');
      component.fireWindowResize();
      tick(2000);
      fixture.detectChanges();
      expect(detectChangesSpy).toHaveBeenCalled();
    }));

    test('should reset values back to initial input', fakeAsync(() => {
      const element = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
      fixture.detectChanges();
      component.setInitialValues();
      fixture.detectChanges();
      element.value = 20;
      fixture.detectChanges();
      component.resetDetailForm();
      fixture.detectChanges();
      expect(element.value).toEqual('10');
    }));

    test('should be able to deactivate form without confirmation', () => {
      const element = fixture.debugElement.queryAll(By.css('input'))[0];
      const messageDialogSpy = jest.spyOn(<any>component, 'messageDialog');
      component.canDeactivate().pipe(first()).subscribe(result => {
        expect(result).toBeTruthy();
        expect(messageDialogSpy).not.toHaveBeenCalled();
      });
      fixture.detectChanges();
      component.detailForm.controls['columnId'].setValue(20);
      component.detailForm.controls['columnId'].markAsDirty();
      component.detailForm.updateValueAndValidity();
      fixture.detectChanges();
      component.canDeactivate().pipe(first()).subscribe(result => {
        expect(messageDialogSpy).toHaveBeenCalled();
      });
    });
  });
});
