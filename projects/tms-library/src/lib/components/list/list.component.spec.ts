import { TestBed, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UxListItemComponentModule } from '@eui/components';

import { UxTMSListItemsComponent } from './list.component';

@Component({
  template: `
    <ux-tms-list-items #listGrid [height]="300">
      <ux-list-item *ngFor="let item of items; let i=index" [item]="item" class="item-padding">
        <uxListItemContent>
          {{ item.id }} - {{ item.desc }}
        </uxListItemContent>
      </ux-list-item>
    </ux-tms-list-items>
  `
})
class TestUxTMSListItemsComponent {
  @ViewChild('listGrid', { static: false })
  public uxTMSListItems: UxTMSListItemsComponent;

  public items: Array<{ id: number, desc: string }> = [];
}

describe('UxTMSListItemsComponent', () => {
  let fixture: ComponentFixture<TestUxTMSListItemsComponent>;
  let component: TestUxTMSListItemsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        UxListItemComponentModule
      ],
      declarations: [TestUxTMSListItemsComponent, UxTMSListItemsComponent]
    }).compileComponents();
  });

  beforeEach(async() => {
    fixture = TestBed.createComponent(TestUxTMSListItemsComponent);
    fixture.detectChanges(); // calls ngOnInit()
    await fixture.whenStable(); // waits for promises to complete
    fixture.detectChanges();

    component = fixture.componentInstance;
    component.items = [
      { id : 10, desc : 'item 10' },
      { id : 20, desc : 'item 20' },
      { id : 30, desc : 'item 30' },
      { id : 40, desc : 'item 40' },
      { id : 50, desc : 'item 50' }
    ];
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();  // reset spyOn after each test
    fixture.destroy();
    component = null;
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });

  test('should select all items and isSingleRowSelected should be true', () => {
    component.uxTMSListItems.rowSelection = 'multiple';
    component.uxTMSListItems.selectListItems(component.items);
    fixture.detectChanges();
    expect(component.uxTMSListItems.isSingleRowSelected()).toBeFalsy();
  });

  test('should select the last item and scroll it into the view', () => {
    component.uxTMSListItems.selectListItems(component.items[component.items.length - 1], true, true);
    fixture.detectChanges();
    component.uxTMSListItems.showSelectedItem();
    fixture.detectChanges();
    expect(component.uxTMSListItems.isSingleRowSelected()).toBeTruthy();
  });

  test('should return first selected item', () => {
    component.uxTMSListItems.selectListItems([
      { id : 10, desc : 'item 10' },
      { id : 20, desc : 'item 20' }]);
    fixture.detectChanges();
    expect(component.uxTMSListItems.getSelectedItem()).toBeDefined();
  });

  test('should return undefined for empty array', () => {
    component.items = [];
    fixture.detectChanges();
    component.uxTMSListItems.selectListItems([]);
    fixture.detectChanges();
    expect(component.uxTMSListItems.getSelectedItem()).toBeUndefined();
  });
});

describe('UxTMSListItemsComponent - Instable', () => {
  let fixture: ComponentFixture<TestUxTMSListItemsComponent>;
  let component: TestUxTMSListItemsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        UxListItemComponentModule
      ],
      declarations: [TestUxTMSListItemsComponent, UxTMSListItemsComponent]
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(TestUxTMSListItemsComponent);
    fixture.detectChanges(); // calls ngOnInit()
    await fixture.whenStable(); // waits for promises to complete
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();  // reset spyOn after each test
    fixture.destroy();
    component = null;
  });

  test('should be created', () => {
    expect(component).toBeTruthy();
  });

  test('should return first selected item', fakeAsync(() => {
    component.uxTMSListItems.selectListItems([
      { id : 10, desc : 'item 10' },
      { id : 20, desc : 'item 20' }]);
    fixture.detectChanges();
    component.items = [
      { id : 10, desc : 'item 10' },
      { id : 20, desc : 'item 20' },
      { id : 30, desc : 'item 30' },
      { id : 40, desc : 'item 40' },
      { id : 50, desc : 'item 50' }
    ];
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.uxTMSListItems.getSelectedItem()).toBeDefined();
  }));
});
