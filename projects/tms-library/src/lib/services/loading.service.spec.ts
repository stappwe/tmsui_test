import { Subscription } from 'rxjs';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;
  let statusSubscription: Subscription;

  beforeEach(() => {
    service = new LoadingService();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.active).toBeFalsy();
  });

  test('should fire start', () => {
    statusSubscription = service.status.subscribe((enabled) => {
      expect(enabled).toBeTruthy();
    });
    service.start();
  });

  test('should fire stop', () => {
    statusSubscription = service.status.subscribe((enabled) => {
      expect(enabled).toBeFalsy();
    });
    service.stop();
  });

  test('should fire disable', () => {
    (service as any)._active = true;
    statusSubscription = service.status.subscribe((enabled) => {
      expect(enabled).toBeFalsy();
      expect(service.active).toBeTruthy();
    });
    service.disable();
  });

  test('should fire enable', () => {
    service.active = true;
    statusSubscription = service.status.subscribe((enabled) => {
      expect(enabled).toBeTruthy();
      expect(service.active).toBeTruthy();
    });
    service.enable();
  });

  afterEach(() => {
    if (statusSubscription) {
      statusSubscription.unsubscribe();
    }
  });
});
