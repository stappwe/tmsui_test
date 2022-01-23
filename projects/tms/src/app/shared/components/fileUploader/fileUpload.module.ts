// Based on https://github.com/valor-software/ng2-file-upload
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FileDropDirective } from './fileDrop.directive';
import { FileSelectDirective } from './fileSelect.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [FileDropDirective, FileSelectDirective],
  exports: [FileDropDirective, FileSelectDirective]
})
export class FileUploadModule {

}
