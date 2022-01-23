import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslateModule } from '@ngx-translate/core';
import { UxAllModule } from '@eui/components';
import { AgGridModule } from 'ag-grid-angular';

import { LanguageFilterComponent } from './components/aggrid/languagefilter/languagefilter.component';
import { EventIdDialogComponent } from './components/dialog/event-id-dialog/event-id-dialog.component';
import { MySettingsComponent } from './components/my-settings/my-settings.component';
import { FileUploadModule } from './components/fileUploader/fileUpload.module';
import { MultiSelectListComponent } from './components/multiselectlist/multiselectlist.component';
import { ViewUploadDocumentsComponent } from './components/view-upload-documents/view-upload-documents.component';
import { DeletedFilter } from './components/general.pipes';
import { TmsLibraryModule, AgDateRendererComponent, AgCheckboxEditor, AgHeaderCheckboxEditor,
  TextFilterComponent, UrlCellRendererComponent, FromToDateFilterComponent, MultiSelectFilterComponent } from 'tms-library';
import { MultiLinkComponent } from './components/multi-link/multi-link.component';

const APP_COMPONENTS = [
  MySettingsComponent,
  ViewUploadDocumentsComponent,
  MultiSelectListComponent
];

@NgModule({
  imports: [CommonModule, RouterModule, UxAllModule, TranslateModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatCheckboxModule,
    MatTooltipModule, MatSelectModule, AgGridModule.withComponents([AgDateRendererComponent, AgCheckboxEditor, AgHeaderCheckboxEditor,
      TextFilterComponent, LanguageFilterComponent, UrlCellRendererComponent, FromToDateFilterComponent, MultiSelectFilterComponent]),
    FileUploadModule, MatSnackBarModule, MatDatepickerModule, MatMomentDateModule, MatFormFieldModule,
    MatInputModule, MatRadioModule, MatProgressSpinnerModule, MatListModule, FlexLayoutModule, TmsLibraryModule, MatProgressBarModule
  ],
  declarations: [APP_COMPONENTS, DeletedFilter, LanguageFilterComponent, EventIdDialogComponent, MultiLinkComponent],
  exports: [CommonModule, RouterModule, UxAllModule, TranslateModule, FormsModule, ReactiveFormsModule, AgGridModule, MatDialogModule,
    MatCheckboxModule, MatSelectModule, MatTooltipModule, FileUploadModule, TmsLibraryModule, APP_COMPONENTS,
    DeletedFilter, MatSnackBarModule, MatDatepickerModule, MatMomentDateModule, MatFormFieldModule,
    MatInputModule, MatRadioModule, MatProgressSpinnerModule, MatListModule, FlexLayoutModule, MatProgressBarModule, MultiLinkComponent]
})
export class SharedModule {
}
