import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { UxAppShellService } from '@eui/core';

import { TMSAdministrationService } from '../../../../../services/tmsAdministration.service';
import { GeneralRoutines, UxTMSListItemsComponent, GridStateStore, TextFilterComponent, BaseListComponent, RefreshData } from 'tms-library';

@Component({
  selector: 'eventtypelist-form',
  templateUrl: './eventtypelist.component.html',
  styleUrls: ['./eventtypelist.component.scss']
})
export class EventTypeListComponent extends BaseListComponent implements OnInit {
  @ViewChild('header', { static: false }) header: ElementRef;
  @ViewChild('listgrid', { static: false }) listgrid: UxTMSListItemsComponent;

  public gridState: GridStateStore;
  public makeRequest$: Subject<number> = new Subject();

  constructor(private formBuilder: FormBuilder, private tmsAdministrationService: TMSAdministrationService, private _router: Router,
              private route: ActivatedRoute, dialog: MatDialog, ngzone: NgZone, cdr: ChangeDetectorRef, private _activatedRoute: ActivatedRoute,
              uxAppShellService: UxAppShellService) {
    super(ngzone, dialog, cdr, uxAppShellService);
    // setup grid and list component + state storage
    this.gridState = new GridStateStore('eventtypelist', this.createColumnDefs(), this.refreshData.bind(this),
      undefined, undefined, undefined, true, false, false);
    this.gridState.gridOptions.context = {
      parent: this
    };
    this.gridState.isGridStateLoaded.subscribe((data: boolean) => {
      this.gridState.listgrid = this.listgrid;
    });
    // Construct the refresh observable to prevent overwriting older requests
    this.makeRequest$.pipe(
      switchMap(() => {
        return this.loadData<RefreshData | {}>(RefreshData, this.tmsAdministrationService.getEventTypeList(), 'Event type list error - ');
      })
    ).subscribe(
      (data: RefreshData) => {
        this.gridState.setData(data.rows, data.rowCount);
        if (this.tmsAdministrationService.appService.application.routerData) {
          this.gridState.doSelectedItems(_.filter(this.gridState.rowData,
            { 'eventTypeId' : this.tmsAdministrationService.appService.application.routerData.ID }));
          this.tmsAdministrationService.appService.application.routerData = undefined;
        }
      }
    );
  }

  ngOnInit() {
    // nothing
  }

  public openEventType(eventTypeId: number): void {
    this._router.navigate(['../', eventTypeId], { relativeTo: this.route });
  }

  public btnPrint(): void {
    window.open(this.tmsAdministrationService.extractEventTypeData().urlWithParams, '_self');
  }

  public onCellClicked($event): void {
    if ($event.colDef.field === 'description' && !this.readOnlyMode) {
      this.openEventType($event.node.data.eventTypeId);
    }
  }

  public lnkEventType($event: any, rowitem: any): void {
    this.gridState.onListSelectItem({ 'item': rowitem, 'ctrlKeyPressed': $event.ctrlKey });
    this.openEventType(rowitem.eventTypeId);
  }

  private createColumnDefs(): Array<any> {
    return [
      { headerName: 'ID', field: 'eventTypeId', width: 60, minWidth: 50, maxWidth: 80, filterFramework: TextFilterComponent,
        filterParams: { apply: true }, orderID: 1, queryParam: 'eventTypeId' },
      { headerName: 'Event Type', field: 'description', width: 150, minWidth: 150, maxWidth: 300, filterFramework: TextFilterComponent,
        cellRenderer: function (params) {
          return (GeneralRoutines.isNullOrUndefined(params.value)) ? '' : '<a>' + params.value + '</a>';
        },
        filterParams: { apply: true }, orderID: 2, queryParam: 'description'
      },
      { headerName: 'Abbreviation', field: 'abbreviation', width: 120, maxWidth: 250, filterFramework: TextFilterComponent,
        filterParams: { apply: true }, orderID: 3, queryParam: 'abbreviation' },
      { headerName: 'Active', headerTooltip: 'Active', field: 'active', width: 100, maxWidth: 200, filterFramework: TextFilterComponent,
        cellRenderer: function (params) {
          return (params.value === 'Y') ? '<span class="fa fa-check" aria-hidden="true"></span>' : '';
        },
        valueGetter: function (params) {
          return (params.data.active) ? 'Y' : 'N';
        }, cellClass: 'text-center', filterParams: { apply: true }, orderID: 4, queryParam: 'active'
      },
      { headerName: 'Status', headerTooltip: 'Status', field: 'status', width: 100, maxWidth: 200, filterFramework: TextFilterComponent,
        cellRenderer: function (params) {
          return (params.value === 'Y') ? '<span class="fa fa-check" aria-hidden="true"></span>' : '';
        },
        valueGetter: function (params) {
          return (params.data.status) ? 'Y' : 'N';
        }, cellClass: 'text-center', filterParams: { apply: true }, orderID: 5, queryParam: 'status'
      },
      { headerName: 'Published', headerTooltip: 'Published on TAIEX web site', field: 'taiexPublish', width: 100,
        maxWidth: 200, filterFramework: TextFilterComponent,
        cellRenderer: function (params) {
          return (params.value === 'Y') ? '<span class="fa fa-check" aria-hidden="true"></span>' : '';
        },
        valueGetter: function (params) {
          return (params.data.taiexPublish) ? 'Y' : 'N';
        }, cellClass: 'text-center', filterParams: { apply: true }, orderID: 6, queryParam: 'taiexPublish'
      },
      { headerName: 'EDB', headerTooltip: 'Published on Expert database', field: 'edbPublish', width: 100, maxWidth: 200, filterFramework: TextFilterComponent,
        cellRenderer: function (params) {
          return (params.value === 'Y') ? '<span class="fa fa-check" aria-hidden="true"></span>' : '';
        },
        valueGetter: function (params) {
          return (params.data.edbPublish) ? 'Y' : 'N';
        }, cellClass: 'text-center', filterParams: { apply: true }, orderID: 7, queryParam: 'edbPublish'
      },
      { headerName: 'Agenda', headerTooltip: 'Agenda required', field: 'agendaRequired', width: 100,
        maxWidth: 200, filterFramework: TextFilterComponent,
        cellRenderer: function (params) {
          return (params.value === 'Y') ? '<span class="fa fa-check" aria-hidden="true"></span>' : '';
        },
        valueGetter: function (params) {
          return (params.data.agendaRequired) ? 'Y' : 'N';
        }, cellClass: 'text-center', filterParams: { apply: true }, orderID: 8, queryParam: 'agendaRequired'
      },
      { headerName: 'Team', field: 'budgetTeam', width: 60, maxWidth: 120, filterFramework: TextFilterComponent,
        filterParams: { apply: true }, orderID: 9, queryParam: 'budgetTeam' },
      { headerName: 'Category', field: 'eventCategory', width: 60, maxWidth: 120, filterFramework: TextFilterComponent,
        filterParams: { apply: true }, orderID: 10, queryParam: 'eventCategory' },
      { headerName: 'UserID', field: 'userId', width: 60, minWidth: 50, maxWidth: 200, filterFramework: TextFilterComponent,
        filterParams: { apply: true }, orderID: 11, queryParam: 'userId'},
      { headerName: 'Evaluation', headerTooltip: 'Send Evaluation forms', field: 'evaluationRequired', width: 100,
        maxWidth: 200, filterFramework: TextFilterComponent,
        cellRenderer: function (params) {
          return (params.value === 'Y') ? '<span class="fa fa-check" aria-hidden="true"></span>' : '';
        },
        valueGetter: function (params) {
          return (params.data.evaluationRequired) ? 'Y' : 'N';
        }, cellClass: 'text-center', filterParams: { apply: true }, orderID: 12, queryParam: 'evaluationRequired'
      }
    ];
  }
}
