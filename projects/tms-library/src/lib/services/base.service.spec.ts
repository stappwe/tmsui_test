import { of } from 'rxjs';

import { BaseService, RefreshData, RequestResult } from './base.service';
import { enAlert } from '../components/class/baseClasses';

describe('Base Service', () => {
  describe('RefreshData class', () => {
    test('should create RefreshData object', () => {
      let refreshData = new RefreshData(50, 1);
      expect(refreshData).toBeTruthy();
      expect(refreshData.rows).toBe(50);
      expect(refreshData.rowCount).toBe(1);
    });
  });

  describe('RequestResult class', () => {
    test('should create RequestResult object', () => {
      let requestResult = new RequestResult();
      let data: any = {};

      expect(requestResult).toBeTruthy();
      expect(requestResult.result).toBeFalsy();
      expect(requestResult.message).toBe('');
      expect(requestResult.messageType).toBe(enAlert.success);
      expect(requestResult.data).toStrictEqual(data);
    });

    test('should create RequestResult object with parameters', () => {
      let requestResult = new RequestResult(true, 'Success', enAlert.danger, { resultString: 'Finished' });

      expect(requestResult).toBeTruthy();
      expect(requestResult.result).toBeTruthy();
      expect(requestResult.message).toBe('Success');
      expect(requestResult.messageType).toBe(enAlert.danger);
      expect(requestResult.data.resultString).toBe('Finished');
    });
  });

  describe('BaseService class', () => {
    let httpClientSpy: any = { post: jest.fn().mockReturnValue(of(true)) };
    let uxAppShellServiceSpy: any = { growl() { console.log('growl called'); } };  // .mockImplementation(any => {})
    let configSpy: any = { appConfig: {}, environment: { apiBaseUrl: '' } };
    let baseService: any;

    beforeEach(() => {
      baseService = new BaseService(httpClientSpy, uxAppShellServiceSpy, configSpy);
    });

    test('should be created', () => {
      expect(baseService).toBeTruthy();
    });

    test('should output to console on logErrorToServer', () => {
      const consoleSpy = jest.spyOn(console, 'error');
      baseService.logErrorToServer('triggered error', true);
      baseService.logErrorToServer('triggered error');
      expect(consoleSpy).toHaveBeenCalled();
    });

    test('should display alert message as not sticky', () => {
      baseService.showAlert('triggered showAlert', enAlert.info);
    });

    test('should display alert message as sticky - danger', () => {
      const growlSpy = jest.spyOn(uxAppShellServiceSpy, 'growl');
      baseService.showAlert('triggered showAlert', enAlert.danger);
      expect(growlSpy).toHaveBeenCalled();
    });

    test('should display alert message as sticky - warning', () => {
      const growlSpy = jest.spyOn(uxAppShellServiceSpy, 'growl');
      baseService.showAlert('triggered showAlert', enAlert.warning);
      expect(growlSpy).toHaveBeenCalled();
    });
  });
});
