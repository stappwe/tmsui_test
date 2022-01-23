import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UrlCellRendererComponent } from './urlCellRenderer.component';

describe('UrlCellRendererComponent', () => {
  let fixture: ComponentFixture<UrlCellRendererComponent>;
  let component: UrlCellRendererComponent;
  let params: any;
  window.open = jest.fn();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UrlCellRendererComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlCellRendererComponent);
    fixture.detectChanges();

    component = fixture.componentInstance;
    // setup agInit
    params = {
      value: 'https://goole.com',
      valueFormatted: null,
      getValue: () => { return 'https://goole.com'; },
      setValue: (value: any) => { console.log(value); },
      formatValue: (value: any) => { return value; },
      data: { personId: 999 },
      node: null,
      colDef: null,
      column: null,
      $scope: null,
      rowIndex: null,
      api: null,
      columnApi: null,
      context: null,
      refreshCell: () => { console.log('refreshCell'); },
      eGridCell: null,
      eParentOfValue: null,
      addRenderedRowListener: (eventType: string, listener: Function) => { console.log('addRenderedRowListener'); },
      url: '#/list/person/{id}',
      idParams: ['personId'],
      readonly: false
    };
    component.agInit(params);
  });

  afterEach(() => {
    jest.clearAllMocks();  // reset spyOn after each test
    fixture.destroy();
    component = null;
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });

  test('should trigger onClick when pressing the link', fakeAsync(() => {
    const windowSpy = jest.spyOn(window, 'open');
    const buttonElement = fixture.debugElement.queryAll(By.css('a'))[0].nativeElement;
    buttonElement.dispatchEvent(new Event('click'));
    tick(100);
    fixture.detectChanges();
    expect(windowSpy).toHaveBeenCalledWith('#/list/person/999', '_blank');
  }));

  test('should return and error due to missing parameter', () => {
    params = { ...params, url: undefined };
    expect(() => {
      component.agInit(params);
    }).toThrowError('URL parameter for UrlCellRendererComponent missing!');
  });

  test('should update the parameters', () => {
    params = {};
    expect(component.refresh(params)).toBeTruthy();
  });
});
