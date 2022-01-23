import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { first } from 'rxjs/operators';

import { PaginationComponent } from './pagination.component';

describe('Pagination', () => {
  let fixture: ComponentFixture<PaginationComponent>;
  let component: PaginationComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent]
    }).compileComponents();
  });

  beforeEach(async() => {
    fixture = TestBed.createComponent(PaginationComponent);
    fixture.detectChanges(); // calls ngOnInit()
    await fixture.whenStable(); // waits for promises to complete
    fixture.detectChanges();

    component = fixture.componentInstance;
  });

  test('should be create', () => {
    expect(component).toBeTruthy();
  });

  test('should navigation correctly', () => {
    component.pageNumber = 1;
    component.maxPageNumber = 5;
    component.totalRows = 50;

    expect(component.totalRowsToString).toBe('50');
    expect(component.maxPageNumberToString).toBe('5');
    component.onNext();
    component.onPageChanged.pipe(first()).subscribe((pageNumber: number) => expect(pageNumber).toBe(2));
    component.onLast();
    component.onPageChanged.pipe(first()).subscribe((pageNumber: number) => expect(pageNumber).toBe(5));
    expect(component.previousPageNumber).toBe(4);
    component.onPrevious();
    component.onPageChanged.pipe(first()).subscribe((pageNumber: number) => expect(pageNumber).toBe(4));
    component.onFirst();
    component.onPageChanged.pipe(first()).subscribe((pageNumber: number) => expect(pageNumber).toBe(1));
    expect(component.nextPageNumber).toBe(2);
  });

  test('should navigation buttons be disabled - ...', () => {
    component.pageNumber = 1;
    component.maxPageNumber = undefined;
    component.totalRows = undefined;

    expect(component.totalRowsToString).toBe('...');
    expect(component.maxPageNumberToString).toBe('...');

    // html verification ...
    fixture.detectChanges();
    const element = fixture.debugElement.queryAll(By.css('.btn'));

    expect(element[0].nativeNode.title).toBe('Page 1/... (total: ...)');
    expect(element[0].nativeNode.disabled).toBeTruthy();
    expect(element[1].nativeNode.disabled).toBeTruthy();
    expect(element[2].nativeNode.disabled).toBeFalsy();
    expect(element[3].nativeNode.disabled).toBeFalsy();

    // html verification 5 pages
    component.maxPageNumber = 5;
    component.totalRows = 250;
    fixture.detectChanges();

    expect(element[1].nativeNode.title).toBe('Page 1/5 (total: 250)');
    expect(element[0].nativeNode.disabled).toBeTruthy();
    expect(element[1].nativeNode.disabled).toBeTruthy();
    expect(element[2].nativeNode.disabled).toBeFalsy();
    expect(element[3].nativeNode.disabled).toBeFalsy();

    // html verification 5 pages
    component.pageNumber = 5;
    fixture.detectChanges();

    expect(element[0].nativeNode.title).toBe('Page 1/5 (total: 250)');
    expect(element[1].nativeNode.title).toBe('Page 4/5 (total: 250)');
    expect(element[2].nativeNode.title).toBe('Page 5/5 (total: 250)');
    expect(element[3].nativeNode.title).toBe('Page 5/5 (total: 250)');
    expect(element[0].nativeNode.disabled).toBeFalsy();
    expect(element[1].nativeNode.disabled).toBeFalsy();
    expect(element[2].nativeNode.disabled).toBeTruthy();
    expect(element[3].nativeNode.disabled).toBeTruthy();
  });
});
