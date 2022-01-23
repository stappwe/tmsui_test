import { TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { UxAppShellService, EUI_CONFIG_TOKEN } from '@eui/core';
import { first } from 'rxjs/operators';

import { RequestErrorInterceptor } from './request-error-interceptior.service';
import { ErrorLogService } from './error-log.service';

const testUrl = '/data';
const tmsuiLogUrl = '/tms-ui-log';

interface Data {
  name: string;
}

describe(`RequestErrorInterceptor`, () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let errorLogService: ErrorLogService;

  let euiConfig = { appConfig: {}, environment: { apiBaseUrl: '' } };

  beforeEach( () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        UxAppShellService,
        ErrorLogService,
        { provide: EUI_CONFIG_TOKEN, useValue: euiConfig },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RequestErrorInterceptor,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    errorLogService = TestBed.inject(ErrorLogService);
  });

  afterEach(() => {
    jest.clearAllMocks();  // reset spyOn after each test
  });

  test('should trigger RequestErrorInterceptor and return error message - status statustext', () => {
    const eMsg = 'deliberate 401 error';
    const logErrorToServerSpy = jest.spyOn(errorLogService, 'logErrorToServer');

    // Make an HTTP GET request
    httpClient.get<Data>(testUrl).pipe(first()).subscribe(
      res => fail('should have failed with the 401 error'),
      (error: HttpErrorResponse) => {
        expect(error.error).toEqual(eMsg);
      }
    );

    // The following `expectOne()` will match the request's URL.
    const req = httpMock.expectOne(testUrl);

    // Respond with mock error
    req.flush(eMsg, { status: 401, statusText: 'Unauthorized' });

    expect(logErrorToServerSpy).toHaveBeenCalled();
  });

  test('should trigger RequestErrorInterceptor from tms-ui-log and not trigger logErrorToServer', () => {
    const eMsg = 'deliberate 401 error';
    const logErrorToServerSpy = jest.spyOn(errorLogService, 'logErrorToServer');

    // Make an HTTP GET request
    httpClient.get<Data>(tmsuiLogUrl).pipe(first()).subscribe(
      res => fail('should have failed with the 401 error'),
      (error: HttpErrorResponse) => {
        expect(error.error).toEqual(eMsg);
      }
    );

    // The following `expectOne()` will match the request's URL.
    const req = httpMock.expectOne(tmsuiLogUrl);

    // Respond with mock error
    req.flush(eMsg, { status: 401, statusText: 'Unauthorized' });

    expect(logErrorToServerSpy).not.toHaveBeenCalled();
  });

  test('should trigger success and return result', () => {
    const eMsg = 'deliberate 200 message';
    const logErrorToServerSpy = jest.spyOn(errorLogService, 'logErrorToServer');

    // Make an HTTP GET request
    httpClient.get<Data>(testUrl).pipe(first()).subscribe(
      res => {
        expect(res).toEqual(eMsg);
      },
      (error: HttpErrorResponse) => {
        fail('should not have failed with the 200 message');
      }
    );

    // The following `expectOne()` will match the request's URL.
    const req = httpMock.expectOne(testUrl);

    // Respond with mock error
    req.flush(eMsg, { status: 200, statusText: '200 message' });

    expect(logErrorToServerSpy).not.toHaveBeenCalled();
  });
});
