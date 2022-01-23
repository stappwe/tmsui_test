import { OnDestroy, Directive } from '@angular/core';

import { Subscription, Subject } from 'rxjs';
import { GridOptions, RowNode } from 'ag-grid-community';
import * as _ from 'lodash';

import { UxTMSListItemsComponent } from '../list/list.component';
import { ColumnState } from 'ag-grid-community/dist/lib/columnController/columnController';

export enum enUpdateType {
  all = 1,
  grid = 2,
  list = 3
}

export type refreshFunction = (pagenumber: number, pagesize: number, options?: any) => void;
export type changeEventFuntion = (event?: any) => void;

export interface IExternalFiltersStore {
  isExternalFilterPresent(): boolean;
  doesExternalFilterPass(node: RowNode): boolean;
  reset();
  getSortFilterQueryString(): any;
}

class ExternalFiltersStore implements IExternalFiltersStore {
  public isExternalFilterPresent(): boolean {
    return false;
  }

  public doesExternalFilterPass(node: RowNode): boolean {
    return true;
  }

  public reset() {
    // do nothing
  }

  public getSortFilterQueryString(): any {
    return {};
  }
}

@Directive()
// tslint:disable-next-line:directive-class-suffix
export class GridStateStore implements OnDestroy {

  get selectedItems(): any[] {
    return this._selectedItems;
  }
  set selectedItems(value: any[]) {
    this._selectedItems = value;
    this.selectedItemsChanged.next(true);
  }

  get isGridLoaded(): boolean {
    return this._isGridLoaded;
  }
  private _selectedItems: any[];  // selected items
  // grid settings
  serverSideNavigation: boolean;  // Server side navigation - Not all data loaded locally
  gridOptions: GridOptions;
  listgrid: UxTMSListItemsComponent;
  storageName: string;
  cacheEnabled: boolean;      // enable saving of filters and data
  cacheData: boolean;         // default true, when false data will not be cached
  // local State information to store and load
  hideSideBar: boolean;
  pageSize: number;
  ColumnState: any[];
  // session state information to store and load
  SortModel: ColumnState[];
  FilterModel: any;
  rowData: any[];
  pageNumber: number; // Current page number
  maxPageNumber: number; // maximum number of pages
  totalRows: number;  // identify the total number of rows
  externalFilters: IExternalFiltersStore;

  private _refreshData: refreshFunction;
  private _filterChanged: changeEventFuntion;
  private _sortChanged: changeEventFuntion;
  private _listenerFilterChanged: any;
  private _listenerSortChanged: any;

  private _updatingGrid: boolean; // check when updating the grid used by filter selection
  private _isGridLoaded: boolean;
  private _triggerRefreshDataSubscription: Subscription;
  public isGridStateLoaded: Subject<boolean> = new Subject();
  public triggerRefreshData: Subject<boolean> = new Subject();
  public selectedItemsChanged: Subject<boolean> = new Subject(); // listen to changes of the selected item

  /**
   * grid store constructor
   * @param storagename - name under which to store the local and session data
   * @param columndefs - grid column definition
   * @param [refreshData=undefined] - function to be called to refresh the data
   * @param [externalfilters=undefined] - external filter to be used for alignment and storage
   * @param [filterChanged=undefined] - function to call in case of filter changes
   * @param [sortChanged=undefined] - function to call in case of sort changes
   * @param [cacheenabled=true] - store session filter - data
   * @param [serverSideNavigation=false] - Used to define server side navigation loading
   * @param [cacheData=true] - defines if data is also cached
   */
  constructor(storagename: string, columndefs: Array<any>, refreshData: refreshFunction = undefined,
              externalfilters: IExternalFiltersStore = new ExternalFiltersStore(),
              filterChanged: changeEventFuntion = undefined, sortChanged: changeEventFuntion = undefined, cacheenabled: boolean = true,
              serverSideNavigation: boolean = false, cacheData: boolean = true) {
    this._listenerFilterChanged = this.onFilterChanged.bind(this);
    this._listenerSortChanged = this.onSortChanged.bind(this);
    this._isGridLoaded = false;
    this.isGridStateLoaded.next(false);
    this._updatingGrid = false;
    this.storageName = storagename;
    this.cacheEnabled = cacheenabled;
    this.serverSideNavigation = serverSideNavigation;
    this.cacheData = cacheData;

    // To restrict menuTabs
    columndefs.forEach((item, index) => {
      if (!item.menuTabs) {
        if (item.filter === true) {
          item.menuTabs = ['generalMenuTab'];
        } else { item.menuTabs = ['filterMenuTab', 'generalMenuTab']; }
      }
    });

    // grid settings: we pass an empty gridOptions in, so we can grab the api out
    this.gridOptions = <GridOptions>{
      defaultColDef: {
        sortable: true,
        resizable: true
      },
      columnDefs: columndefs,
      suppressMenuHide: true,
      // to disable the property check
      suppressPropertyNamesCheck : true,
      // To suppress right click menu from ag-grid and use default right click menu
      suppressContextMenu: true,
      // To suppress tool panel Pivoting
      sideBar: {
        hiddenByDefault: this.hideSideBar,
        toolPanels: [{
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
            suppressSideButtons: true,
            suppressColumnFilter: true,
            suppressColumnSelectAll: true,
            suppressColumnExpandAll: true
          }
        }]
      },
      excelStyles: [
        {
          id: 'header',
          interior: {
            color: '#3071a9',
            pattern: 'Solid',
            patternColor: '#3071a9'
          },
          font: { color: '#ffffff' },
        },
        {
          id: 'text-right',
          alignment: {
            horizontal: 'Right'
          }
        }
      ],
      isExternalFilterPresent: externalfilters.isExternalFilterPresent.bind(externalfilters),
      doesExternalFilterPass: externalfilters.doesExternalFilterPass.bind(externalfilters)
    };
    this.hideSideBar = true;
    this.pageNumber = 1;
    this.maxPageNumber = undefined;
    this.totalRows = undefined;
    this.pageSize = 50;
    this.rowData = [];
    this.selectedItems = [];
    // external filter. Not used but in gridstate object but only to save and load settings
    this.externalFilters = externalfilters;
    // assign refresh data function
    this._refreshData = refreshData;
    this._filterChanged = filterChanged;
    this._sortChanged = sortChanged;
    // load settings if exist in local storage and session
    this.load();
    this._triggerRefreshDataSubscription = this.triggerRefreshData.subscribe((value: boolean) => {
      this.refreshData();
    });
  }

  ngOnDestroy() {
    this._triggerRefreshDataSubscription.unsubscribe();
  }

  /**
   * Save state information to local and session storage
   */
  public store(): boolean {
    try {
      // Use only local storage if cookie consent has been accepted
      if (window['euCookieConsent'] === undefined ||
          (window['euCookieConsent'] !== undefined && window['euCookieConsent'].accepted('europa'))) {
        // Local storage data
        window.localStorage.setItem(this.storageName, JSON.stringify({
          'hideSideBar' : this.hideSideBar,
          'pageSize' : this.pageSize,
          'ColumnState' :  this.ColumnState
        }));
      } else {
        window.sessionStorage.setItem(this.storageName + '_loc', JSON.stringify({
          'hideSideBar' : this.hideSideBar,
          'pageSize' : this.pageSize,
          'ColumnState' :  this.ColumnState
        }));
      }

      if (this.cacheEnabled === true) {
        // Session storage data
        window.sessionStorage.setItem(this.storageName, JSON.stringify({
          'SortModel' : this.SortModel,
          'FilterModel' : this.FilterModel,
          'rowData' : (this.cacheData === true) ? this.rowData : [],
          'pageNumber' : this.pageNumber,
          'maxPageNumber' : (this.cacheData === true) ? this.maxPageNumber : undefined,
          'totalRows' : (this.cacheData === true) ? this.totalRows : undefined,
          'selectedItems' : (this.cacheData === true) ? this.selectedItems : [],
          'externalFilters' : this.externalFilters
        }));
      }
    } catch (e) {
      console.log('store saving failed: ' + e);
      window.localStorage.removeItem(this.storageName);
      window.sessionStorage.removeItem(this.storageName);
      return false;
    }

    return true;
  }

  public load(): boolean {
    try {
      // Use only local storage if cookie consent has been accepted
      if (window['euCookieConsent'] === undefined ||
          (window['euCookieConsent'] !== undefined && window['euCookieConsent'].accepted('europa'))) {
        // load localstorage state settings
        const localStateStr = window.localStorage.getItem(this.storageName);
        if (localStateStr !== null) {
          const localState = JSON.parse(localStateStr);
          this.hideSideBar = localState.hideSideBar;
          this.pageSize = localState.pageSize;
          this.ColumnState = localState.ColumnState;
        }
      } else {
        const localStateStr = window.sessionStorage.getItem(this.storageName + '_loc');
        if (localStateStr !== null) {
          const localState = JSON.parse(localStateStr);
          this.hideSideBar = localState.hideSideBar;
          this.pageSize = localState.pageSize;
          this.ColumnState = localState.ColumnState;
        }
      }

      if (this.cacheEnabled === true) {
        // load localstorage state settings
        const sessionStateStr = window.sessionStorage.getItem(this.storageName);
        if (sessionStateStr !== null) {
          const sessionState = JSON.parse(sessionStateStr);
          this.SortModel = sessionState.SortModel;
          this.FilterModel = sessionState.FilterModel;
          this.rowData = (this.cacheData === true) ? sessionState.rowData : [];
          this.pageNumber = sessionState.pageNumber;
          this.maxPageNumber = (this.cacheData === true) ? sessionState.maxPageNumber : undefined;
          this.totalRows = (this.cacheData === true) ? sessionState.totalRows : undefined;
          this.selectedItems = (this.cacheData === true) ? sessionState.selectedItems : [];
          if (this.externalFilters) {
            this.externalFilters = _.merge(this.externalFilters, sessionState.externalFilters);
          }
        }
      }
    } catch (e) {
      console.log('store loading failed: ' + e);
      window.localStorage.removeItem(this.storageName);
      window.sessionStorage.removeItem(this.storageName);
      return false;
    }

    return true;
  }

  public resetGrid(storagename: string, columndefs: any[]) {
    this.storageName = storagename;
    // grid settings: we pass an empty gridOptions in, so we can grab the api out
    this.gridOptions = <GridOptions>{
      columnDefs: columndefs,
      suppressMenuHide: true,
      // to disable the property check
      suppressPropertyNamesCheck : true,
      // To suppress right click menu from ag-grid and use default right click menu
      suppressContextMenu: true,
      // To suppress tool panel Pivoting
      sideBar: {
        hiddenByDefault: this.hideSideBar,
        toolPanels: [{
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
            suppressSideButtons: true,
            suppressColumnFilter: true,
            suppressColumnSelectAll: true,
            suppressColumnExpandAll: true
          }
        }]
      },
      rowDragManaged: true,
      animateRows: true,
      allowDragFromColumnsToolPanel: true,
      excelStyles: [
        {
          id: 'header',
          interior: {
            color: '#3071a9',
            pattern: 'Solid',
            patternColor: '#3071a9'
          },
          font: { color: '#ffffff' },
        },
        {
          id: 'text-right',
          alignment: {
            horizontal: 'Right'
          }
        }
      ]
    };
    this.hideSideBar = true;
    this.pageNumber = 1;
    this.maxPageNumber = undefined;
    this.totalRows = undefined;
    this.pageSize = 40;
    this.rowData = [];
    this.selectedItems = [];
  }

  public reset(resetExternalFilter: boolean = true): void {
    let triggeredRefresh: boolean = false;
    let externalFiltered: boolean = false;
    // 1. reset settings
    if (typeof this._refreshData === 'function' && this.serverSideNavigation === true) { // exclude reset if local filter
      this.pageNumber = 1;
      this.maxPageNumber = undefined;
      this.totalRows = undefined;
      this.pageSize = 50;
      this.rowData = [];
      this.selectedItems = [];
    }
    // 2. Reset external filters
    if (this.externalFilters && this.externalFilters.isExternalFilterPresent()) {
      if (resetExternalFilter === true) {
        this.externalFilters.reset();
      }
      externalFiltered = true;
    }
    // 3. Clear sort settings
    if (this.gridOptions.api && this.gridOptions.api.getFilterModel() &&
        _.findKey(this.gridOptions.api.getFilterModel(), function(o) { return o.filter !== ''; })) {
      this.gridOptions.api.setFilterModel(null);
      triggeredRefresh = true;
    } else { this.FilterModel = {}; }
    // 4. Clear sort settings
    if (this.gridOptions.columnApi && this.gridOptions.columnApi.getColumnState() &&
        this.gridOptions.columnApi.getColumnState().filter(function (s) { return s.sort != null; }).length !== 0) {
      this.gridOptions.columnApi.applyColumnState({ defaultState: { sort: null } });
      triggeredRefresh = true;
    } else { this.SortModel = []; }

    if (triggeredRefresh === false && (externalFiltered === true || (typeof this._refreshData === 'function' && this.serverSideNavigation === true))) {
      this.triggerRefreshData.next(true); // trigger refresh
    }
  }

  /**
   * Check if row is selected or if selected row is defined by the field with the value
   * @param field
   * @param value
   * @returns
   */
  public isRowSelected(field?: string, value?: any): boolean {
    if (field !== undefined && value !== undefined) {
      return this.selectedItems.length > 0 && _.find(this.selectedItems, [field, value]) !== undefined;
    } else {
      return this.selectedItems.length > 0;
    }
  }

  public isSingleRowSelected(): boolean {
    return this.selectedItems.length === 1;
  }

  public areRowsSelected(): boolean {
    return this.selectedItems.length > 0;
  }

  /**
   * Replace the existing rowData with the rows and rowcount
   * @param rows - grid rows
   * @param rowcount - total number of rows applicable to the filter
   * @param pk - pk field
   * @param pkValue - pk value or pk Array to select
   */
  public setData(rows: Array<any>, rowcount?: number, pk?: string, pkValue?: any | any[]): void {
    // Set data
    this.rowData = rows;
    // Clear selection
    this.selectedItems = [];
    if (this.gridOptions.api) {
      this.gridOptions.api.setRowData(this.rowData);
      if (rowcount !== undefined) {
        this.totalRows = rowcount;
        this.maxPageNumber = Math.ceil(rowcount / this.pageSize);
      }
      if (pk && pkValue) {
        if (pkValue instanceof Array) {
          this.doSelectedItems(_.filter(this.rowData, (item) => _.includes(pkValue, item[pk])));
        } else {
          this.doSelectedItems(_.filter(this.rowData, JSON.parse('{ "' + pk + '": ' + pkValue + ' }')));
        }
      }
    }
  }

  public getData(): Array<any> {
    let data: Array<any> = [];
    this.gridOptions.api.forEachNode(item => {
      data.push(item.data);
    });

    return data;
  }

  /**
   * clear Data, usuallly after error or any other issue
   */
  public clearData(): void {
    this.setData([], 0);
  }

  public doSelectedItems(selecteditems: any[], updateType?: enUpdateType): void {
    if (!_.isEqual(this.selectedItems, selecteditems)) {
      this.selectedItems = selecteditems;
      this.setSelectedItems(updateType, true);
    }
  }

  public doRemoveAllSelectedItems(): void {
    this.selectedItems = [];
    this.setSelectedItems();
  }

  public setSelectedItems(updateType: enUpdateType = undefined, scroll: boolean = false): void {
    updateType = (updateType !== undefined) ? updateType : enUpdateType.all;
    if (updateType === enUpdateType.all || updateType === enUpdateType.grid) {
      try {
        this._updatingGrid = true;
        if (this.gridOptions.api) {
          this.gridOptions.api.deselectAll();
          if (this.selectedItems.length > 0) {
            // selection in grid
            let rowsFound: number = 0;
            this.gridOptions.api.forEachNode(function(node) {
              if (this.selectedItems.filter(function (item) {
                return item === node.data;
              }).length > 0) {
                rowsFound++;
                node.setSelected(true);
                if (rowsFound === 1) {
                  this.gridOptions.api.ensureNodeVisible(node, 'top');
                } else if (rowsFound === this.selectedItems.length) {
                  return;
                }
              }
            }.bind(this));
          }
        }
      } finally {
        this._updatingGrid = false;
      }
    }
    // selection in list
    if ((updateType === enUpdateType.all || updateType === enUpdateType.list) &&
        this.selectedItems.length > 0 && this.listgrid !== undefined) {
      this.listgrid.selectListItems(this.selectedItems, true, scroll);
    }
  }

  public doColumnResize($event: any): void {
    if (this.gridOptions.api && $event.clientHeight > 0) {
      this.gridOptions.api.sizeColumnsToFit();
    }
  }

  public refreshData(resetPagination: boolean = false, options: any = {}): void {
    if (typeof this._refreshData === 'function') {
      if (resetPagination === true) {
        this.pageNumber = 1;
      }
      this._refreshData(this.pageNumber, this.pageSize, options);
    } else { this.setData(this.rowData, this.rowData.length); }
  }

  public onFilterChanged(event: any): void {
    if (this.gridOptions.api && JSON.stringify(this.FilterModel) !== JSON.stringify(this.gridOptions.api.getFilterModel())) {
      this.doSaveFilterState();
      if (this.serverSideNavigation === true) {
        this.triggerRefreshData.next(true); // trigger refresh
      } else if (!_.findKey(this.gridOptions.api.getFilterModel(), function(o) { return o.filter !== ''; })) {
        this.setData(this.rowData, this.rowData.length);  // empty filter
      }
    }
  }

  public onSortChanged(event: any): void {
    if (this.gridOptions.api && JSON.stringify(this.SortModel) !== JSON.stringify(this.gridOptions.columnApi.getColumnState())) {
      this.doSaveSortState();
      if (this.serverSideNavigation === true) {
        this.triggerRefreshData.next(true); // trigger refresh
      } else { this.setData(this.rowData, this.rowData.length); }
    }
  }

  // Grid events
  public onGridReady($event: any): void {
    console.log('Grid ' + this.storageName + ' ready');
    this.gridOptions.api.addEventListener('columnVisible', () => this.doSaveColumnState());
    this.gridOptions.api.addEventListener('columnResized', () => this.doSaveColumnState());
    this.gridOptions.api.addEventListener('columnValueChanged', () => this.doSaveColumnState());
    this.gridOptions.api.addEventListener('columnMoved', () => this.doSaveColumnState());
    // set rowData
    this.gridOptions.api.setRowData(this.rowData);
    this.setSelectedItems();
    // set state
    if (this.ColumnState !== undefined) {
      this.gridOptions.columnApi.setColumnState(this.ColumnState);
    } else { // set default state settings
      this.doSaveColumnState();
    }
    // set sort
    if (this.SortModel !== undefined) {
      this.gridOptions.columnApi.setColumnState(this.SortModel);
    } else { // set default state settings
      this.doSaveSortState();
    }
    // set filter
    if (this.FilterModel !== undefined) {
      this.gridOptions.api.setFilterModel(this.FilterModel);
    } else { // set default state settings
      this.doSaveFilterState();
    }

    // if no data available in session, then reload
    if (this.rowData.length === 0) {
      this.triggerRefreshData.next(true); // trigger refresh
    }
    // resize column
    this.doColumnResize($event);

    // Listener to Filter changes
    this.gridOptions.api.addEventListener('filterChanged', this._listenerFilterChanged);
    // Listener to Sort changes
    this.gridOptions.api.addEventListener('sortChanged', this._listenerSortChanged);
    this._isGridLoaded = true;
    this.isGridStateLoaded.next(true);
  }

  public onGridResize($event: any): void {
    this.doColumnResize($event);
  }

  public onGridSelectionChanged($event: any): void {
    // get selected node + current selection
    if (this._updatingGrid === false) {
      let selectedItems: any[] = [];
      if (this.gridOptions.api) {
        selectedItems = _.map(this.gridOptions.api.getSelectedNodes(), 'data');
      }
      if (!_.isEqual(this.selectedItems, selectedItems)) {
        this.selectedItems = selectedItems;
        this.setSelectedItems(enUpdateType.list, selectedItems !== []);
      }
    }
  }

  public onGridPageChanged($event: any): void {
    this.pageNumber = $event;
    this.triggerRefreshData.next(true); // trigger refresh
  }

  // List events
  public onListSelectItem($event: { 'item': any, 'ctrlKeyPressed': any }): void {
    let data = ($event.item === undefined) ? [] : ($event.item instanceof Array) ? $event.item : [$event.item];
    if ($event.ctrlKeyPressed === true && this.listgrid.rowSelection === 'multiple') {
      this.selectedItems = _.union(this.selectedItems, data);
    } else {
      this.selectedItems = data;
    }
    this.setSelectedItems(enUpdateType.all);
  }

  public resetSort(): void {
    this.gridOptions.api.refreshHeader();
  }

  /**
   * Add row to the end of the grid.
   * @param data - data to add
   * @param pk - pk field
   * @param pkValue - pk value to set
   */
  public addRow(data: any, pk?: string, pkValue?: any): void {
    this.rowData.push(data);
    if (pk && pkValue) {
      this.setData(this.rowData, this.totalRows + 1, pk, pkValue);
    }
  }

  /**
   * replace row data for the specifief pk field with the value = pkValue
   * @param data
   * @param pk
   * @param pkValue
   */
  public replaceRow(data: any, pk: string, pkValue: any): void {
    let existingRows = _.filter(this.rowData, JSON.parse('{ "' + pk + '": ' + pkValue + ' }'));
    if (existingRows.length === 1) {
      existingRows[0] = Object.assign(existingRows[0], data);
      this.setData(this.rowData, this.totalRows, pk, pkValue);
    }
  }

  /**
   * delete row data from the grid
   * @param data - object to delete from that array
   */
  public deleteRow(data: any): void {
    this.rowData.remove(data);
    this.setData(this.rowData, this.rowData.length);
  }

  /**
   * Extract based on the filter and sorting applied to the grid the query string needed to extract the data from the database.
   * External filters are included via the function getSortFilterQueryString from the IExternalFiltersStore
   * In the column definition of the grid the orderID and queryParam value need to be included
   * @param withPagination - include pagination details
   * @returns - Query string containing all filters and sort
   */
  public getSortFilterQueryString(withPagination: boolean = false): any {
    let sortFieldList: string = '';
    let sortOrderList = '';
    let externalFilterList = '';
    let separator = '';
    let sortFilterObject: any = {};

    if (this.SortModel && this.SortModel.length > 0) {
      for (let k = 0; k < this.SortModel.length; k++) {
        let sortColModel = this.SortModel[k];
        if (sortColModel.sort !== null) {
          let sortOrder = sortColModel.sort === 'asc' ? '1' : '2';
          let sortField = '';

          sortField = _.filter(this.gridOptions.columnDefs, { 'field': sortColModel.colId })[0]['orderID'];

          sortFieldList += separator + sortField;
          sortOrderList += separator + sortOrder;
          separator = '_';
        }
      }
    }

    let filterFieldList: any = {};
    if (this.FilterModel && Object.keys(this.FilterModel).length > 0) {
      separator = '&';
      let filterParam: string;
      let queryParam: string;
      let filterField: string;
      let filterObject: Object;
      for (let k = 0; k < Object.keys(this.FilterModel).length; k++) {
        filterField = Object.keys(this.FilterModel)[k];
        filterObject = this.FilterModel[filterField];

        if (filterObject['type'] === 1 || filterObject['type'] === 2 || filterObject['type'] === 6) {  // text filter || 6 = MultiSelect filter
          if (filterObject['filter'] !== '') {
            filterParam = (this.gridOptions.api.getFilterInstance(filterField).getFrameworkComponentInstance().filterTypes.length > 1) ?
              filterObject['type'] + '_' : '';
            filterParam += filterObject['filter'];
            queryParam = _.filter(this.gridOptions.columnDefs, { 'field': filterField })[0]['queryParam'];
            filterFieldList[queryParam] = filterParam;
          }
        } else if (filterObject['type'] === 3) {  // Language filter
          if (filterObject['from'] && filterObject['to']) {
            filterParam = filterObject['from'] + '_' + filterObject['to'];
            queryParam = _.filter(this.gridOptions.columnDefs, { 'field': filterField })[0]['queryParam'];
            filterFieldList[queryParam] = filterParam;
          }
        } else if (filterObject['type'] === 5) {  // FromToDate filter
          if (filterObject['fromDate'] !== null || filterObject['toDate'] !== null) {
            let fromDate = (filterObject['fromDate'] !== null) ? filterObject['fromDate'].format('DD/MM/YYYY') : '';
            let toDate = (filterObject['toDate'] !== null) ? filterObject['toDate'].format('DD/MM/YYYY') : '';
            filterParam = filterObject['type'] + '_' + fromDate + '_' + toDate;
            queryParam = _.filter(this.gridOptions.columnDefs, { 'field': filterField })[0]['queryParam'];
            filterFieldList[queryParam] = filterParam;
          }
        }
      }
    }

    if (this.externalFilters) {
      externalFilterList = this.externalFilters.getSortFilterQueryString();
    }

    sortFilterObject.sortFieldList = (sortFieldList.length > 0) ? sortFieldList : '';
    sortFilterObject.sortOrderList = sortOrderList;
    sortFilterObject.filterFieldList = filterFieldList;
    sortFilterObject.externalFilterList = externalFilterList;

    if (withPagination === true) {
      sortFilterObject.startRow = ((this.pageNumber - 1) * this.pageSize) + 1;
      sortFilterObject.endRow = this.pageNumber * this.pageSize;
    }

    return sortFilterObject;
  }

  private doSaveColumnState(): void {
    // Save state settings
    if (this.gridOptions.columnApi) {
      this.ColumnState = this.gridOptions.columnApi.getColumnState();
    }
  }

  private doSaveFilterState(): void {
    // Save state settings
    if (this.gridOptions.api && JSON.stringify(this.FilterModel) !== JSON.stringify(this.gridOptions.api.getFilterModel())) {
      this.FilterModel = this.gridOptions.api.getFilterModel();
      this.SortModel = this.gridOptions.columnApi.getColumnState();
      // check if event handler is linked
      if (typeof this._filterChanged === 'function' && this.isGridLoaded) {
        this._filterChanged();
      }
    }
  }

  private doSaveSortState(): void {
    // Save state settings
    if (this.gridOptions.api && JSON.stringify(this.SortModel) !== JSON.stringify(this.gridOptions.columnApi.getColumnState())) {
      this.SortModel = this.gridOptions.columnApi.getColumnState();
      this.FilterModel = this.gridOptions.api.getFilterModel();
      // check if event handler is linked
      if (typeof this._sortChanged === 'function' && this.isGridLoaded) {
        this._sortChanged();
      }
    }
  }
}
