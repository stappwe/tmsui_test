import { Directive } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const DATE_FORMAT_QQ_YYYY = {
  parse: {
    dateInput: 'Q YYYY',
  },
  display: {
    dateInput: 'Q YYYY',
    monthYearLabel: 'Q YYYY',
    dateA11yLabel: 'Q YYYY',
    monthYearA11yLabel: 'Q YYYY',
  },
};

@Directive({
  selector: '[quarterDateFormat]',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_QQ_YYYY },
  ],
})
export class QuarterDateFormatDirective {
}
