import { Injectable, Inject, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { UpdateUserDetailsAction, EUI_CONFIG_TOKEN, UxAppShellService, handleError, UserDetails, EuiConfig } from '@eui/core';

import { BaseService, RequestResult } from 'tms-library';
import { UserCategory } from '../features/+tms/+administration/+administrator/shared/administrator.model';
import { UserDetail } from '../features/+tms/+administration/shared/adminitration.model';

@Injectable({
  providedIn: 'root',
})
export class TMSUserService extends BaseService {
  constructor(http: HttpClient, private store: Store<any>, uxAppShellService: UxAppShellService, injector: Injector) {
    super(http, uxAppShellService, injector);
  }

  public getUserProfile(): Observable<any> {
    return this.http.get(this.apiBaseUrl + 'user/profile').pipe(
      map((result: UserDetails) => {
        this.store.dispatch(new UpdateUserDetailsAction(result));
        return result;
      }),
      catchError((error: any) => handleError(error))
    );
  }

  public getRequestUserCategoryList(applicationName: string): Observable<Array<UserCategory> | {}> {
    let targetUrl = this.apiBaseUrl + 'register/user-category-list/' + applicationName;
    return this.http.get(targetUrl).pipe(
      map((data: any) => {
        const userCategoryList: Array<UserCategory> = [];
        for (const item of data) {
          userCategoryList.push(Object.assign(new UserCategory(), item));
        }
        return userCategoryList;
      }),
      catchError(error => handleError(error))
    );
  }

  public requestAccess(user: UserDetail): Observable<RequestResult | {}> {
    const targetUrl = this.apiBaseUrl + 'register/user-request-access';
    const dto = JSON.stringify(user);
    return this.http.post(targetUrl, dto, { headers: this._headers }).pipe(
      map((data: any) => {
        return Object.assign(new RequestResult(), data);
      }),
      catchError(error => handleError(error))
    );
  }
}
