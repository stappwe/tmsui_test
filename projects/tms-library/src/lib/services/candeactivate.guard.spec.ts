import { CanDeactivate } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { Observable, of } from 'rxjs';

import { CanDeactivateGuard, ICanDeactivateGuard } from './candeactivate.guard';

class MockComponent implements CanDeactivate<ICanDeactivateGuard> {
  // Set this to the value you want to mock being returned from GuardedComponent
  returnValue: boolean;

  canDeactivate(): Observable<boolean> {
    return of(this.returnValue);
  }
}

describe('CanDeactivateGuardService', () => {
  let mockComponent: MockComponent;
  let service: CanDeactivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CanDeactivateGuard,
        MockComponent
      ]
    });
    service = TestBed.inject(CanDeactivateGuard);
    mockComponent = TestBed.inject(MockComponent);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should be able to continue routing', () => {
    // Mock GuardedComponent.isGuarded = false, which returns true from canActivate()
    mockComponent.returnValue = true;
    expect(service.canDeactivate(mockComponent)).toBeTruthy();
  });
});
