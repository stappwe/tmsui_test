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
  selector: 'projectlist-form',
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.scss']
})
export class ProjectListComponent extends BaseListComponent implements OnInit {
  @ViewChild('header', { static: false }) header: ElementRef;
  @ViewChild('listgrid', { static: false }) listgrid: UxTMSListItemsComponent;

  public gridState: GridStateStore;
  public makeRequest$: Subject<number> = new Subject();

  constructor(private formBuilder: FormBuilder, private tmsAdministrationService: TMSAdministrationService, private _router: Router,
              private route: ActivatedRoute, dialog: MatDialog, ngzone: NgZone, cdr: ChangeDetectorRef, private _activatedRoute: ActivatedRoute,
              uxAppShellService: UxAppShellService) {
    super(ngzone, dialog, cdr, uxAppShellService);
    // setup grid and list component + state storage
    this.gridState = new GridStateStore('projectlist', this.createColumnDefs(), this.refreshData.bind(this),
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
        return this.loadData<RefreshData | {}>(RefreshData, this.tmsAdministrationService.getProjectList(), 'Project list error - ');
      })
    ).subscribe(
      (data: RefreshData) => {
        this.gridState.setData(data.rows, data.rowCount);
        if (this.tmsAdministrationService.appService.application.routerData) {
          this.gridState.doSelectedItems(_.filter(this.gridState.rowData,
            { 'projectId': this.tmsAdministrationService.appService.application.routerData.ID }));
          this.tmsAdministrationService.appService.application.routerData = undefined;
        }
      }
    );
  }

  ngOnInit() {
    // nothing
  }

  public openProject(projectId: number): void {
    this._router.navigate(['../', projectId], { relativeTo: this.route });
  }

  public btnPrint(): void {
    window.open(this.tmsAdministrationService.extractProjectList().urlWithParams, '_self');
  }

  public onCellClicked($event): void {
    if ($event.colDef.field === 'description' && !this.readOnlyMode) {
      this.openProject($event.node.data.projectId);
    }
  }

  public lnkProject($event: any, rowitem: any): void {
    this.gridState.onListSelectItem({ 'item': rowitem, 'ctrlKeyPressed': $event.ctrlKey });
    this.openProject(rowitem.projectId);
  }

  private createColumnDefs(): Array<any> {
    return [
      { headerName: 'Project ID', field: 'projectId', width: 60, minWidth: 50, maxWidth: 80, filterFramework: TextFilterComponent,
        filterParams: { apply: true }, orderID: 1, queryParam: 'projectId' },
      { headerName: 'Project', tooltipField: 'description', field: 'description', width: 150, minWidth: 150, maxWidth: 300,
        filterFramework: TextFilterComponent,
        cellRenderer: function (params) {
          return (GeneralRoutines.isNullOrUndefined(params.value)) ? '' : '<a>' + params.value + '</a>';
        },
        filterParams: { apply: true }, orderID: 2, queryParam: 'description'
      },
      { headerName: 'Abbreviation', field: 'abbreviation', width: 120, maxWidth: 250, filterFramework: TextFilterComponent,
        filterParams: { apply: true }, orderID: 3, queryParam: 'abbreviation' },
      { headerName: 'Consultation', headerTooltip: 'Consultation', field: 'consultation', width: 45, maxWidth: 45, suppressSizeToFit: true,
        filterFramework: TextFilterComponent,
        filterParams: { apply: true, filterOptions: ['contains'], debounceMs: 50 }, cellClass: 'text-center',
        valueFormatter: GeneralRoutines.convertToOnlyYes,
        valueGetter: function (params) {
          return (params.data.consultation === 1) ? 'Y' : 'N';
        }, orderID: 4, queryParam: 'consultation' },
      { headerName: 'General Email', tooltipField: 'generalEmail', field: 'generalEmail', width: 120, maxWidth: 250, filterFramework: TextFilterComponent,
        filterParams: { apply: true }, orderID: 5, queryParam: 'generalEmail' },
      { headerName: 'Signature Email - HTML', tooltipField: 'signatureEmail', field: 'signatureEmail', width: 120, maxWidth: 250,
        filterFramework: TextFilterComponent,
        filterParams: { apply: true }, orderID: 6, queryParam: 'signatureEmail' },
      { headerName: 'Signature Email - Outlook', tooltipField: 'signatureEmailOutlook', field: 'signatureEmailOutlook', width: 120, maxWidth: 250,
        filterFramework: TextFilterComponent,
        filterParams: { apply: true }, orderID: 7, queryParam: 'signatureEmailOutlook' },
      { headerName: 'Email Request Validator', tooltipField: 'emailRequestValidator', field: 'emailRequestValidator', width: 120, maxWidth: 250,
        filterFramework: TextFilterComponent,
        filterParams: { apply: true }, orderID: 8, queryParam: 'emailRequestValidator' },
      { headerName: 'Comment', tooltipField: 'comment', field: 'comment', width: 120, maxWidth: 300, filterFramework: TextFilterComponent,
        filterParams: { apply: true }, orderID: 9, queryParam: 'comment' }
    ];
  }
}
