import { Component, ContentChildren, ViewChild, ElementRef, QueryList, forwardRef, Input } from '@angular/core';

import { UxListItemsComponent, UxListItemComponent } from '@eui/components';

import * as _ from 'lodash';

@Component({
  selector: 'ux-tms-list-items',
  templateUrl : './list.component.html',
  styleUrls : ['./list.component.css']
})
export class UxTMSListItemsComponent extends UxListItemsComponent {
  @Input() rowSelection: string;
  @Input() canSelect: boolean;
  @Input() fullHeight: boolean;
  @Input() height: number;

  private list: QueryList<UxListItemComponent>;
  private listEl: QueryList<ElementRef>;
  private containerEl: ElementRef;
  private itemsToSelect: any[] = [];

  @ContentChildren(forwardRef(() => UxListItemComponent))
  set updateList(list: QueryList<UxListItemComponent>) {
    this.list = list;
    setTimeout(() => {
      if (this.itemsToSelect.length > 0) {
        this.selectListItems(this.itemsToSelect, true, true);
      }
    });
  }
  @ContentChildren(forwardRef(() => UxListItemComponent), { read: ElementRef })
  set updateListEl(listEl: QueryList<ElementRef>) {
    this.listEl = listEl;
    setTimeout(() => {
      if (this.itemsToSelect.length > 0) {
        this.selectListItems(this.itemsToSelect, true, true);
      }
    });
  }
  @ViewChild('container', { static: false })
  set updateContainerEl(containerEl: ElementRef) {
    this.containerEl = containerEl;
    setTimeout(() => {
      if (this.itemsToSelect.length > 0) {
        this.selectListItems(this.itemsToSelect, true, true);
      }
    });
  }

  get classList(): string {
    return this.fullHeight ? '' : 'list-content';
  }

  constructor(elementRef: ElementRef) {
    super(elementRef);
    this.canSelect = true;
    this.fullHeight = false;
    this.rowSelection = 'single';
  }

  public selectListItems(data: any | any[], clearSelection?: boolean, scroll?: boolean): void {
    scroll = (scroll !== undefined) ? scroll : false;
    clearSelection = (clearSelection !== undefined) ? clearSelection : true;
    // Convert data to array if needed
    data = (data instanceof Array) ? data : [data];
    let rowsFound: number = 0;
    // deactivate all tabs
    if (this.containerEl && this.list.toArray().length > 0 && this.listEl.toArray().length > 0) {
      this.itemsToSelect = [];
      this.list.toArray().forEach((listitem: UxListItemComponent, i: number) => {
        if (clearSelection || this.rowSelection === 'single') {
          listitem.isActive = false;
        }
        if (this.canSelect === true && data.filter(function (item) {
          return _.isEqual(item, listitem.item);
        }).length > 0) {
          if ((this.rowSelection === 'single' && rowsFound === 0) || (this.rowSelection !== 'single')) {
            rowsFound++;
            listitem.isActive = true;
            if (scroll && rowsFound === 1) {
              if (this.containerEl && this.listEl) {
                let element = this.listEl.toArray()[i].nativeElement,
                  elementRect = element.getBoundingClientRect();
                setTimeout(() => {
                  this.containerEl.nativeElement.scrollTop = elementRect.top - this.containerEl.nativeElement.offsetTop;
                });
              }
            }
          }
        }
      });
    } else {
      this.itemsToSelect = data;
    }
  }

  public showSelectedItem(): void {
    // deactivate all tabs
    if (this.containerEl && this.list.toArray().length > 0 && this.listEl.toArray().length > 0) {
      let item: UxListItemComponent;
      let itemArray = this.list.toArray();
      for (let i = 0; i < itemArray.length; i++) {
        item = itemArray[i];
        if (item.isActive) {
          let element = this.listEl.toArray()[i].nativeElement,
            elementRect = element.getBoundingClientRect();
          setTimeout(() => {
            this.containerEl.nativeElement.scrollTop = elementRect.top - this.containerEl.nativeElement.offsetTop;
          });
          break;
        }
      }
    }
  }

  public isSingleRowSelected(): boolean {
    return this.list ? _.filter(this.list.toArray(), ['isActive', true]).length === 1 : false;
  }

  public getSelectedItem(): any {
    if (this.list) {
      let selectedItems = _.filter(this.list.toArray(), ['isActive', true]);
      return selectedItems.length > 0 ? selectedItems[0] : undefined;
    } else {
      return undefined;
    }
  }
}
