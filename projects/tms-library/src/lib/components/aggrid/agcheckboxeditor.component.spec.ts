import { FormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AgCheckboxEditor } from './agcheckboxeditor.component';

describe('AgCheckboxEditor', () => {
  let fixture: ComponentFixture<AgCheckboxEditor>;
  let component: AgCheckboxEditor;
  let params: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [AgCheckboxEditor]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgCheckboxEditor);
    fixture.detectChanges();

    component = fixture.componentInstance;
    // setup agInit
    params = {
      value: 'cell_value',
      valueFormatted: null,
      getValue: () => { return 'https://goole.com'; },
      setValue: (value: any) => { console.log(value); },
      formatValue: (value: any) => { return value; },
      data: { paramCheckbox: false },
      node: { setDataValue: (colKey, newValue) => { console.log(colKey + ' ' + newValue.toString()); } },
      colDef: 'paramCheckbox',
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

  test('should set the node value to true', () => {
    const setDataValueSpy = jest.spyOn((component as any).params.node, 'setDataValue');
    const inputElement = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
    inputElement.checked = true;
    inputElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(setDataValueSpy).toHaveBeenCalledWith('paramCheckbox', true);
  });

  test('should update the parameters', () => {
    params = {};
    expect(component.refresh(params)).toBeTruthy();
  });
});
