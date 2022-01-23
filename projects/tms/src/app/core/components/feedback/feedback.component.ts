import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';
import { GeneralRoutines } from 'tms-library';
import { environment } from '../../../../environments/environment';

export enum enReportType {
  Feedback = 1,
  Bug = 2
}

@Component({
  selector: 'app-core-feedback',
  templateUrl: './feedback.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class FeedbackComponent {
  @Input() reportType: enReportType;
  @Input() settings: any;

  constructor(private coreService: CoreService) {
    this.reportType = enReportType.Feedback;
  }

  btnSend(event: any) {
    let url = environment.apiBaseUrl + 'mail/send-feedback/' + this.reportType;
    GeneralRoutines.openURL(url);
    this.btnCancel(event);
  }

  btnCancel(event: any) {
    if (this.reportType === enReportType.Feedback) {
      this.coreService.isFeedbackToolOpen = false;
    } else {
      this.coreService.isBugFeedbackToolOpen = false;
    }
  }
}
