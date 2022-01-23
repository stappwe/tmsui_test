import { HttpErrorResponse } from '@angular/common/http';

import { of } from 'rxjs';

import { ErrorLogService } from './error-log.service';

describe('ErrorLog Service', () => {
  let httpClientSpy: any = { post: jest.fn().mockReturnValue(of(true)) };
  let uxAppShellServiceSpy: any = { growl() { console.log('growl called'); } };  // .mockImplementation(any => {})
  let configSpy: any = { appConfig: {}, environment: { apiBaseUrl: '' } };
  let errorLogService: any;

  beforeEach(() => {
    errorLogService = new ErrorLogService(httpClientSpy, uxAppShellServiceSpy, configSpy);
  });

  afterEach(() => {
    jest.clearAllMocks();  // reset spyOn after each test
  });

  test('should be created', () => {
    expect(errorLogService).toBeTruthy();
  });

  test('should output to console and logErroToServer on logAngularToServer - String error', () => {
    const growlSpy = jest.spyOn(uxAppShellServiceSpy, 'growl');
    const consoleSpy = jest.spyOn(console, 'error');
    const logErrorToServerSpy = jest.spyOn(errorLogService, 'logErrorToServer');

    expect(errorLogService.logAngularToServer('Triggered error', true))
      .toEqual(expect.stringContaining('Something happened! Triggered error'));
    expect(consoleSpy).toHaveBeenCalled();
    expect(growlSpy).toHaveBeenCalled();
    expect(logErrorToServerSpy).toHaveBeenCalled();

  });

  test('should output to console and logErroToServer on logAngularToServer - HttpErrorResponse - error status', () => {
    let errorResponse;
    errorResponse = new HttpErrorResponse({
      error: '404 error',
      status: 404, statusText: 'Not Found'
    });
    const growlSpy = jest.spyOn(uxAppShellServiceSpy, 'growl');
    const consoleSpy = jest.spyOn(console, 'error');
    const logErrorToServerSpy = jest.spyOn(errorLogService, 'logErrorToServer');

    expect(errorLogService.logAngularToServer(errorResponse))
      .toEqual(expect.stringContaining('404 Not Found'));
    expect(consoleSpy).toHaveBeenCalled();
    expect(growlSpy).not.toHaveBeenCalled();
    expect(logErrorToServerSpy).toHaveBeenCalled();
  });

  test('should output to console and logErroToServer on logAngularToServer - TypeError', () => {
    let errorResponse = new TypeError('Divided by zero error');
    const consoleSpy = jest.spyOn(console, 'error');
    const logErrorToServerSpy = jest.spyOn(errorLogService, 'logErrorToServer');

    expect(errorLogService.logAngularToServer(errorResponse))
      .toEqual(expect.stringContaining('Divided by zero error'));
    expect(consoleSpy).toHaveBeenCalled();
    expect(logErrorToServerSpy).toHaveBeenCalled();
  });

  test('should output to console and logErroToServer on logAngularToServer - Error', () => {
    let errorResponse = new Error('General error');
    const consoleSpy = jest.spyOn(console, 'error');
    const logErrorToServerSpy = jest.spyOn(errorLogService, 'logErrorToServer');

    expect(errorLogService.logAngularToServer(errorResponse))
      .toEqual(expect.stringContaining('General error'));
    expect(consoleSpy).toHaveBeenCalled();
    expect(logErrorToServerSpy).toHaveBeenCalled();
  });
});
