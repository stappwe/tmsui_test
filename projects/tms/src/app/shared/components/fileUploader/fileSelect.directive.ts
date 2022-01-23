import { Directive, ElementRef, Input, Output, DoCheck, EventEmitter, HostListener } from '@angular/core';

import { FileUploader } from './fileUploader.class';

// todo: filters

@Directive({
  selector: '[file-select]'
})
export class FileSelectDirective implements DoCheck {
  @Input() public uploader: FileUploader;
  @Output() public uploadChanges: EventEmitter<boolean> = new EventEmitter<boolean>();

  private element: ElementRef;

  public constructor(element: ElementRef) {
    this.element = element;
  }

  ngDoCheck() {
    if (this.uploader.queueChanged) {
      this.uploader.queueChanged = false;
      this.uploadChanges.emit(true);
    }
  }

  public getOptions(): any {
    return this.uploader.options;
  }

  public getFilters(): any {
    return void 0;
  }

  public isEmptyAfterSelection(): boolean {
    return !!this.element.nativeElement.attributes.multiple;
  }

  @HostListener('change')
  public onChange(): any {
    // let files = this.uploader.isHTML5 ? this.element.nativeElement[0].files : this.element.nativeElement[0];
    let files = this.element.nativeElement.files;
    let options = this.getOptions();
    let filters = this.getFilters();

    // if(!this.uploader.isHTML5) this.destroy();

    this.uploader.addToQueue(files, options, filters);
    if (this.isEmptyAfterSelection()) {
      this.element.nativeElement.type = '';
      this.element.nativeElement.type = 'file';
      // todo
      /*this.element.nativeElement.value = '';
      this.element.nativeElement
       .replaceWith(this.element = this.element.nativeElement.clone(true)); // IE fix*/
    }
  }
}
