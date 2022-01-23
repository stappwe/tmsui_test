import { FormsModule } from '@angular/forms';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AgHeaderCheckboxEditor } from './agheadercheckboxeditor.component';

describe('AgHeaderCheckboxEditor', () => {
  let fixture: ComponentFixture<AgHeaderCheckboxEditor>;
  let component: AgHeaderCheckboxEditor;
  let params: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [AgHeaderCheckboxEditor]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgHeaderCheckboxEditor);
    fixture.detectChanges();

    component = fixture.componentInstance;
    // setup agInit
    params = {
      column: null,
      displayName: '',
      enableSorting: false,
      enableMenu: false,
      showColumnMenu: (source: HTMLElement) => { console.log('showColumnMenu'); },
      progressSort: (multiSort?: boolean) => { console.log('progressSort'); },
      setSort: (sort: string, multiSort?: boolean) => { console.log('setSort'); },
      columnApi: null,
      api: null,
      context: null,
      template: undefined,
      selectAll: (value: boolean, param: any) => { console.log('selectAll'); }
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

  test('should trigger onChange and selectAll with value = true', () => {
    const selectAllSpy = jest.spyOn((component as any).params, 'selectAll');
    const inputElement = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
    inputElement.checked = true;
    inputElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(selectAllSpy).toHaveBeenCalledWith(true, params);
  });
});
