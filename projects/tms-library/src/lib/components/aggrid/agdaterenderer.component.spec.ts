import { FormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import * as moment from 'moment';
import { AgDateRendererComponent } from './agdaterenderer.component';

describe('AgDateRendererComponent', () => {
  let fixture: ComponentFixture<AgDateRendererComponent>;
  let component: AgDateRendererComponent;
  let params: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [AgDateRendererComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgDateRendererComponent);
    fixture.detectChanges();

    component = fixture.componentInstance;
    // setup agInit
    params = {
      value: moment('05/04/2020', 'DD/MM/YYYY').toDate(),
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
      addRenderedRowListener: (eventType: string, listener: Function) => { console.log('addRenderedRowListener'); }
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

  test('should set the public value', () => {
    expect(component.value).toBe(params.value);
  });

  test('should update the parameters', () => {
    params = {};
    expect(component.refresh(params)).toBeTruthy();
  });
});
