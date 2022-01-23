import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Subscription, forkJoin, fromEvent } from 'rxjs';
import { first, throttleTime } from 'rxjs/operators';
import { ColDef } from 'ag-grid-community';
import * as _ from 'lodash';
import { UxAppShellService } from '@eui/core';

import { GeneralRoutines, IMultiSelectOption, TextFilterComponent, GridStateStore, UxTMSListItemsComponent, BaseMessageComponent, enAlert } from 'tms-library';
import { FileUploader, ParsedResponseHeaders } from '../fileUploader/fileUploader.class';
import { FileItem } from '../fileUploader/fileItem.class';
import { enApplicationType } from '../models/userProfile.model';
import { FileLikeObject } from '../fileUploader/fileLikeObject.class';
import { enFilePermission, enUploadStatus, ViewUploadFile } from '../models/viewUploadFile.model';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'view-upload-documents-form',
  templateUrl: './view-upload-documents.component.html',
  styleUrls: ['./view-upload-documents.component.scss']
})
export class ViewUploadDocumentsComponent extends BaseMessageComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('header', { static: false }) header: ElementRef;
  @ViewChild('listgrid', { static: false }) listgrid: UxTMSListItemsComponent;

  @Input() id: number;            // taskId, eventId, twinningID, supplierId
  @Input() pkType: number;
  @Input() filterOnTemplateID: number;  // Specify templateId which could be upload or not filter allows all types to be uploaded
  @Input() readOnlyMode: boolean;
  @Input() contentHeight: number;
  @Output() closed: EventEmitter<boolean> = new EventEmitter<boolean>(); // emit close event to parent

  private queryParam$: Subscription;
  private idSubscription$: Subscription;
  private _windowResize: Subscription;
  private loadAppTypeDataSubscription: Subscription;
  private _allowedFileTypes: Array<string> = [];
  private _dropzoneVisible: boolean = false;
  public isPrinting: boolean;

  public backURL: string = '';    // url used to route back to previous location
  public templates: Array<IMultiSelectOption>;
  public templateId: number;
  public uploading: boolean;
  // grid settings
  public gridHeight: number;
  public gridState: GridStateStore;
  // upload properties
  public uploader: FileUploader = new FileUploader({
    url: '',
    allowedFileType: this.allowedFileTypes
  });
  public DropZoneOver: boolean = false;

  get allowedFileTypes(): Array<string> {
    return this._allowedFileTypes;
  }
  set allowedFileTypes(values: Array<string>) {
    this._allowedFileTypes = values;
    // Initializing the FileUploader allowedFileType
    this.uploader.options.allowedFileType = this._allowedFileTypes;
  }

  get acceptFileTypes(): string {
    return this.allowedFileTypes.map(item => '.' + item).join(', ');
  }

  constructor(private ngzone: NgZone, private cdr: ChangeDetectorRef, private _activatedRoute: ActivatedRoute, private _router: Router,
              @Inject(forwardRef(() => AppService)) public appService: AppService, dialog: MatDialog,
              uxAppShellService: UxAppShellService) {
    super(dialog, uxAppShellService);
    this.uploading = false;
    this.templateId = -1;
    this.readOnlyMode = true;
    // 1. setup grid and list component + state storage
    this.gridState = new GridStateStore('viewUpload_' + this.appService.application.appTypeString.toLowerCase(),
      this.createColumnDefs(), this.refreshData.bind(this), undefined, undefined, undefined, false);
    this.gridState.gridOptions.defaultColDef.filter = true;
    this.gridState.gridOptions.context = {
      parent: this
    };

    this.uploader.onAfterAddingAll = function(fileItems: Array<FileItem>): void {
      // 1. set uploading flag and add upload records to array
      this.uploading = true;
      // 2. Check if new files were added to the queue based on - demo only
      for (let i = fileItems.length - 1; i >= 0; i--) {
        fileItems[i].file.templateId = this.templateId;
        this.gridState.rowData.insert(0, new ViewUploadFile(-1, this.templateId, fileItems[i].file.name, '', fileItems[i].file.size,
          fileItems[i].file.lastModifiedDate, undefined, undefined, fileItems[i]));
      }
      this.gridState.setData(this.gridState.rowData, this.gridState.rowData.length);
      // 3. upload the files. Once completed the onCompleteAll will be triggered from where the processing starts
      this.uploader.uploadAll();
    }.bind(this);

    this.uploader.onProgressItem = function(item: FileItem, progress: any): void {
      let rowDataItem = _.find(this.gridState.rowData, ['queueItem', item]);
      if (rowDataItem !== undefined) { // if found
        rowDataItem.progress = item.progress;
        this.gridState.gridOptions.api.redrawRows();
      }
    }.bind(this);

    this.uploader.onCompleteItem = function(item: FileItem, response: any, status: number, headers: ParsedResponseHeaders): void {
      // 1. get result
      let result = JSON.parse(response);
      if (response !== undefined && status === 200) {
        item.file.uploadID = result.id;
        // 2. Find uploaded
        let rowDataItem = _.find(this.gridState.rowData, ['queueItem', item]) as ViewUploadFile;
        if (rowDataItem !== undefined) { // if found
          // 2. set uploadID
          rowDataItem.file.id = item.file.uploadID;
          if (item.isSuccess === true) {
            rowDataItem.status = enUploadStatus.success;
          } else if (item.isCancel === true) {
            rowDataItem.status = enUploadStatus.cancel;
          } else if (item.isError === true) {
            rowDataItem.status = enUploadStatus.error;
          }
          rowDataItem.queueItem = undefined;
        }
      }
      // 2. Update layout
      this.gridState.gridOptions.api.redrawRows();
    }.bind(this);

    this.uploader.onCompleteAll = function(): any {
      // 1. Extract process and succeeded files to be processed by the backend
      let uploadedFiles = _.map(_.filter(this.uploader.queue, ['isSuccess', true]), function(item: FileItem) {
        return { 'uploadID' : item.file.uploadID, 'templateId' : item.file.templateId };
      });
      this.gridState.refreshData();
      this.uploading = false;
      return void 0;
    }.bind(this);

    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: any) => {
      this.uploading = false;
      this.gridState.gridOptions.api.redrawRows();
      this.showAlert('Error during upload - ' + response, enAlert.danger);
    };

    this.uploader.onWhenAddingFileFailed = (item: FileLikeObject, filter: any, options: any): any => {
      this.showAlert('Invalid file or format not accepted. The following file type are allowed: ' +
          this.acceptFileTypes, enAlert.warning);
    };

    this.loadAppTypeDataSubscription = this.appService.application.appTypeChanged.subscribe((value: enApplicationType) => {
      this.loadAppTypeData(value, this.templateId);
    });
  }

  ngOnInit() {
    this.backURL = '';
    // Link grid to list object
    this.gridState.listgrid = this.listgrid;

    this.idSubscription$ = this._activatedRoute.params.subscribe(params => {
      if (params['viewuploadtype'] && params['templateid']) {
        this.id = (params['id']) ? params['id'] : '';
        this.pkType = (params['viewuploadtype']) ? params['viewuploadtype'] : '';
        this.filterOnTemplateID = (params['templateid']) ? parseInt(params['templateid'], 10) : -1;
        this.templateId = (params['templateid']) ? parseInt(params['templateid'], 10) : -1;
        this.readOnlyMode = (params['readonlymode']) ? params['readonlymode'] === 'true' : false;

        // Initializing the FileUploader url
        this.uploader.options.url = this.appService.getDocumentUploadUrl(this.id, this.pkType, this.filterOnTemplateID);
        // Load templates and allowed file types
        this.loadAppTypeData(this.appService.application.appType, this.templateId);
      }
    });

    this.queryParam$ = this._activatedRoute.queryParams.subscribe(params => {
      this.backURL = (params['routerURL']) ? params['routerURL'] : '';
    });
  }

  ngAfterViewInit() {
    this.ngzone.runOutsideAngular( () =>
      this._windowResize = fromEvent(window, 'resize').pipe(
        throttleTime(250)
      ).subscribe(function() {
          if (this.header !== undefined) {
            if (this.contentHeight) {
              this.gridHeight = this.contentHeight - (this.header.nativeElement.offsetTop + this.header.nativeElement.offsetHeight);
            } else {
              // -15 as spacing on the bottom
              this.gridHeight = window.innerHeight - (this.header.nativeElement.offsetTop + this.header.nativeElement.offsetHeight) - 15;
            }
            this.cdr.detectChanges();
          }
        }.bind(this))
    );
    this.fireWindowResize();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterOnTemplateID'] !== undefined && changes['filterOnTemplateID'].currentValue !== undefined) { // filterOnTemplateID changes
      this.templateId = changes['filterOnTemplateID'].currentValue;
    }
    if ((changes['id'] !== undefined && changes['id'].currentValue !== undefined) ||
        (changes['pkType'] !== undefined && changes['pkType'].currentValue !== undefined) ||
        (changes['filterOnTemplateID'] !== undefined && changes['filterOnTemplateID'].currentValue !== undefined)) { // id, pkType or TemplateID changes
      // Initializing the FileUploader url
      this.uploader.options.url = this.appService.getDocumentUploadUrl(this.id, this.pkType, this.filterOnTemplateID);
      // Load templates and allowed file types
      this.loadAppTypeData(this.appService.application.appType, this.templateId);
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.gridState.store();
    this._windowResize.unsubscribe();
    this.loadAppTypeDataSubscription.unsubscribe();
    this.idSubscription$.unsubscribe();
    this.queryParam$.unsubscribe();
  }

  public DropzoneVisible(): boolean {
    let visible = this.templateId !== -1 && this.uploading === false && this.readOnlyMode === false;
    if (visible !== this._dropzoneVisible) {
      this._dropzoneVisible = visible;
      this.fireWindowResize();
    }
    return visible;
  }

  public fireWindowResize(): void {
    setTimeout(() => {
      let event = document.createEvent('HTMLEvents');
      event.initEvent('resize', true, false);
      window.dispatchEvent(event);
    }, 0);
  }

  public getSizeInMB(value: number): string {
    return (value / 1024 / 1024).toFixed(3) + ' MB';
  }

  public getTemplateName(value: number): string {
    let name: string = '';
    if (value && this.templates && _.filter(this.templates, ['id', value])[0]) {
      name = _.filter(this.templates, ['id', value])[0].name;
    }

    return name;
  }

  public getNameURL(id: number): string {
    return this.appService.getDocumentDownloadURL(id, this.pkType);
  }

  public refreshData(pagenumber: number, pagesize: number): void {
    if (this.id && this.pkType && this.filterOnTemplateID) {
      if (this.gridState.gridOptions.api) { this.gridState.gridOptions.api.showLoadingOverlay(); }
      this.appService.getDocuments(this.id, this.pkType, this.filterOnTemplateID).subscribe(
        function (data: Array<ViewUploadFile>): void {
          this.gridState.setData(data, data.length);
        }.bind(this),
        errMsg => { this.showAlert('document list error - ' + errMsg, enAlert.danger); }
      );
    }
  }

  public fileOverDropZone(e: any): void {
    this.DropZoneOver = e;
  }

  public resetUpload(): void {
    this.uploading = false;
    for (let i = 0; i < this.gridState.selectedItems.length; i++) {
      if (this.gridState.selectedItems[i] instanceof ViewUploadFile && this.gridState.selectedItems[i].queueItem instanceof FileItem) {
        this.gridState.selectedItems[i].queueItem.reset();
      }
    }
    this.gridState.gridOptions.api.redrawRows();
  }

  public btnRefresh(): void {
    this.gridState.refreshData(true);
  }

  public canDeleteDocument(): boolean {
    if (this.uploading === false && this.gridState.isSingleRowSelected() === true && this.readOnlyMode === false &&
      this.appService.hasAction('btn_supplier_document_update')) {
      if (this.gridState.selectedItems[0] !== undefined) {
        return (this.gridState.selectedItems[0].file.permission & enFilePermission.delete) === enFilePermission.delete;
      } else { return false; }
    } else { return false; }
  }

  public btnDeleteDocument(): void {
    // 1. Check if user is sure to delete the item
    this.messageDialog('Delete selected documents?').subscribe(
      function(result: any): void {
        if (result === true) {
          this.appService.deleteDocument(this.gridState.selectedItems[0].file.id, this.pkType, this.id, this.filterOnTemplateID).subscribe(
            function(data: any): void {  // add
              if (data === true) {
                // remove the selected item from the rowdata
                this.gridState.deleteRow(this.gridState.selectedItems[0]);
                this.showAlert('Delete succeeded', enAlert.success);
              } else {
                this.showAlert('Delete failed. Document ID ' + this.gridState.selectedItems[0] + ' is missing!', enAlert.danger);
              }
            }.bind(this),
            errMsg => { this.showAlert('Document delete failed - ' + errMsg, enAlert.danger); });
        }
      }.bind(this));
  }

  public btnClear(): void {
    this.gridState.reset();
  }

  public btnPrint(): void {
    this.isPrinting = true;
    window.open(this.appService.extractViewUploadData(this.id, this.pkType, this.filterOnTemplateID), '_self');
    this.isPrinting = false;
  }

  public btnClose(): void {
    if (this.backURL !== '') {
      this._router.navigateByUrl(this.backURL);
    } else if (this.closed.observers.length !== 0) {
      this.closed.emit(true);
    }
  }

  private loadAppTypeData(value: enApplicationType, templateId: number): void {
    this.templates = [];
    this.allowedFileTypes = [];

    if (this.pkType) {
      // Load templates and allowed file types
      const templates = this.appService.getTemplates(templateId);
      const allowedFileTypes = this.appService.getAllowedFileTypes(this.pkType);
      forkJoin(templates, allowedFileTypes).pipe(first())
        .subscribe(
          (res: Array<any>) => {
            this.templates = res[0];
            this.allowedFileTypes = res[1];

            if (this.gridState.gridOptions.api) {
              this.gridState.refreshData();
            }
          },
          errMsg => {
            this.showAlert('View/upload detail loading failed - ' + errMsg, enAlert.danger);
          }
        );
    }
  }

  private createColumnDefs(): Array<ColDef> {
    return [
      { headerName: 'Type', field: 'file.templateId', width: 150, minWidth: 150, maxWidth: 200, filterParams: { apply: true },
        filterFramework: TextFilterComponent,
        valueFormatter: function (params) {      // Function cell renderer
          return params.context.parent.getTemplateName(params.value);
        }
      },
      {
        headerName: 'Name', field: 'file.name', width: 250, minWidth: 400, maxWidth: 300, filterParams: { apply: true }, filterFramework: TextFilterComponent,
        cellRenderer: function (params) {      // Function cell renderer
          if (params.data.file.url && params.data.file.url !== '') {
            return '<a href="' + params.data.file.url + '" target="document">' + params.data.file.url + '</a>';
          } else {
            return '<a href="' + params.context.parent.getNameURL(params.data.file.id) + '" target="document">' + params.data.file.name + '</a>';
          }
        }
      },
      { headerName: 'Size', field: 'file.size', width: 300, maxWidth: 300, filterParams: { apply: true }, filterFramework: TextFilterComponent,
        cellClass: ['text-center'],
        valueFormatter: function (params) {      // Function cell renderer
          if (!params.data.file.url || params.data.file.url === '') {
            return params.context.parent.getSizeInMB(params.value);
          } else { return ''; }
        }
      },
      { headerName: 'Last modified', field: 'file.lastModified', width: 300, maxWidth: 235, filter: false,
        valueFormatter: function (params) {
          return GeneralRoutines.convertToDate(params, 'DD/MM/YYYY HH:mm');
        }
      },
      { headerName: 'By', field: 'file.lastModifiedBy', width: 200, maxWidth: 200, filterParams: { apply: true }, filterFramework: TextFilterComponent },
      { headerName: 'Progress', field: 'progress', width: 80, maxWidth: 400, sortable: false, filter: false,
        //  cellClass: ['text-center'],
        cellRenderer: function (params) {      // Function cell renderer
          if (params.data.file.id === -1) {
            return '<div class="progress"> ' +
              '<div class="progress-bar text-center" role="progressbar" aria-valuenow="' + params.value + '" ' +
              'aria-valuemin="0" aria-valuemax="100" style="min-width: 2em; width: ' + params.value + '%;">' + params.value + '%</div>' +
              '</div>';
          } else { return ''; }
        }
      },
      { headerName: 'Status', field: 'status', width: 100, maxWidth: 150, sortable: false, filter: false,
        cellClass: ['text-center'],
        cellRenderer: function (params) {      // Function cell renderer
          if (params.value === enUploadStatus.success) {
            return '<i class="fa fa-check"></i>';
          } else if (params.value === enUploadStatus.cancel) {
            return '<i class="fa fa-ban"></i>';
          } else if (params.value === enUploadStatus.error) {
            return '<i class="fa fa-times"></i>';
          } else { return ''; }
        }
      }
    ];
  }
}
