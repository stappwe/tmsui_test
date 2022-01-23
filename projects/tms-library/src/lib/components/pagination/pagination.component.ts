/* tslint:disable:max-line-length */
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pagination',
  template: `
    <div class="btn-toolbar {{class}}" role="group" aria-label="Page navigation">
      <button type="button" class="btn btn-primary" title="Page 1/{{ maxPageNumberToString }} (total: {{ totalRowsToString }})" (click)="onFirst()" [disabled]="pageNumber <= 1">
        <span class="fa fa-step-backward" aria-hidden="true"></span>
      </button>
      <button type="button" class="btn btn-primary" title="Page {{ previousPageNumber }}/{{ maxPageNumberToString }} (total: {{ totalRowsToString }})" (click)="onPrevious()" [disabled]="pageNumber <= 1">
        <span class="fa fa-caret-left" aria-hidden="true"></span>
      </button>
      <button type="button" class="btn btn-primary" title="Page {{ nextPageNumber }}/{{ maxPageNumberToString }} (total: {{ totalRowsToString }})" (click)="onNext()" [disabled]="pageNumber >= maxPageNumber">
        <span class="fa fa-caret-right" aria-hidden="true"></span>
      </button>
      <button type="button" class="btn btn-primary" title="Page {{ maxPageNumberToString }}/{{ maxPageNumberToString }} (total: {{ totalRowsToString }})" (click)="onLast()" [disabled]="pageNumber >= maxPageNumber">
        <span class="fa fa-step-forward" aria-hidden="true"></span>
      </button>
    </div>
  `
})
export class PaginationComponent {
  @Input() class: string;
  @Input() maxPageNumber: number;
  @Input() pageNumber: number;
  @Input() totalRows: number;

  @Output() onPageChanged: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
    this.maxPageNumber = typeof this.maxPageNumber !== 'undefined' ? this.maxPageNumber : 1;
    this.pageNumber = 1;
  }

  public onFirst(): void {
    this.pageNumber = 1;
    this.onPageChanged.emit(this.pageNumber);
  }

  public onPrevious(): void {
    this.pageNumber = this.pageNumber - 1;
    this.onPageChanged.emit(this.pageNumber);
  }

  public onNext(): void {
    this.pageNumber = this.pageNumber + 1;
    this.onPageChanged.emit(this.pageNumber);
  }

  public onLast(): void {
    this.pageNumber = this.maxPageNumber;
    this.onPageChanged.emit(this.pageNumber);
  }

  get previousPageNumber(): number {
    return (this.pageNumber === 1) ? 1 : this.pageNumber - 1;
  }

  get nextPageNumber(): number {
    return (this.pageNumber === this.maxPageNumber) ? this.maxPageNumber : this.pageNumber + 1;
  }

  get maxPageNumberToString(): string {
    return (this.maxPageNumber !== undefined) ? this.maxPageNumber.toString() : '...';
  }

  get totalRowsToString(): string {
    return (this.totalRows !== undefined) ? this.totalRows.toString() : '...';
  }
}
