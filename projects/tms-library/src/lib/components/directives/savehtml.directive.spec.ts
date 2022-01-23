import { SimpleChange } from '@angular/core';

import { SaveHtmlDirective } from './savehtml.directive';

describe('SaveHtmlDirective', () => {
  let elementRef: any = { nativeElement: { innerHTML: '' } };
  let sanitizer: any = { sanitize: jest.fn().mockReturnValue('SaveHTML') };
  let saveHtml: SaveHtmlDirective;

  beforeEach(() => {
    saveHtml = new SaveHtmlDirective(elementRef, sanitizer);
  });

  test('should be created', () => {
    expect(saveHtml).toBeTruthy();
  });

  test('should output to console on logErrorToServer', () => {
    saveHtml.ngOnChanges({ 'safeHtml': new SimpleChange(null, 'SaveHTML', true) });
    expect(elementRef.nativeElement.innerHTML).toEqual('SaveHTML');
  });
});
