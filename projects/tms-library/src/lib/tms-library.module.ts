import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FlexLayoutModule } from '@angular/flex-layout';

import { UxIconComponentModule, UxFormGroupComponentModule, UxListItemComponentModule } from '@eui/components';
import { TranslateModule } from '@ngx-translate/core';

import './components/objectExtensions';

import { PaginationComponent } from './components/pagination/pagination.component';
import { CommentDialog } from './components/dialog/comment-dialog/comment-dialog.component';
import { MessageDialog } from './components/dialog/message-dialog/messagedialog.component';
import { LabelInputComponent } from './components/label/labelInput.component';
import { TextareaWithSizeComponent } from './components/textareaWithSize/textareaWithSize.component';
import { SaveHtmlDirective } from './components/directives/savehtml.directive';
import { FromToDateFilterComponent } from './components/aggrid/from-to-date-filter/from-to-date-filter.component';
import { TextFilterComponent } from './components/aggrid/textfilter/textfilter.component';
import { UrlCellRendererComponent } from './components/aggrid/urlCellRenderer/urlCellRenderer.component';
import { AgCheckboxEditor } from './components/aggrid/agcheckboxeditor.component';
import { AgDateRendererComponent } from './components/aggrid/agdaterenderer.component';
import { AgHeaderCheckboxEditor } from './components/aggrid/agheadercheckboxeditor.component';
import { MultiselectDropdown } from './components/multiselect/multiselect.component';
import { UxTMSListItemsComponent } from './components/list/list.component';
import { LoadingComponent } from './components/animation/loading.component';
import { RangeDatePickerComponent } from './components/rangedatepicker/rangedatepicker.component';
import { TreeMultiSelectFilter, TreeMultiSelectComponent } from './components/treeMultiSelect/treeMultiSelect.component';
import { MultiSelectFilterComponent } from './components/aggrid/multi-select-filter/multi-select-filter.component';
import { QuarterDateFormatDirective } from './components/directives/quarter-date-format.directive';
import { TMSDateFormatDirective, TMSDatetimeFormatDirective } from './components/directives/date-formats.directive';
import { FormCellComponent } from './components/aggrid/form-cell/form-cell.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';

@NgModule({
  declarations: [PaginationComponent, CommentDialog, MessageDialog, LabelInputComponent, TextareaWithSizeComponent, SaveHtmlDirective,
    FromToDateFilterComponent, TextFilterComponent, UrlCellRendererComponent, AgCheckboxEditor, AgDateRendererComponent, AgHeaderCheckboxEditor,
    MultiselectDropdown, UxTMSListItemsComponent, LoadingComponent, RangeDatePickerComponent, TreeMultiSelectFilter, TreeMultiSelectComponent,
    MultiSelectFilterComponent, QuarterDateFormatDirective, TMSDateFormatDirective, TMSDatetimeFormatDirective, FormCellComponent, VideoPlayerComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule, UxIconComponentModule, MatDatepickerModule, MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule, MatListModule, MatCheckboxModule, UxFormGroupComponentModule, UxListItemComponentModule, TranslateModule.forChild({})],
  exports: [PaginationComponent, CommentDialog, MessageDialog, LabelInputComponent, TextareaWithSizeComponent, SaveHtmlDirective,
    FromToDateFilterComponent, TextFilterComponent, UrlCellRendererComponent, AgCheckboxEditor, AgDateRendererComponent, AgHeaderCheckboxEditor,
    MultiselectDropdown, UxTMSListItemsComponent, LoadingComponent, RangeDatePickerComponent, TreeMultiSelectFilter, TreeMultiSelectComponent,
    MultiSelectFilterComponent, QuarterDateFormatDirective, TMSDateFormatDirective, TMSDatetimeFormatDirective, FormCellComponent, VideoPlayerComponent]
})
export class TmsLibraryModule { }
