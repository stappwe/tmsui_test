import { Inject, Injectable } from '@angular/core';
import {
  CONFIG_TOKEN,
  UserService,
  ModuleConfig,
  EuiAppConfig,
  UserDetails,
  UserPreferences,
  StoreService,
  getUserId,
  UserState,
  UxUserRight,
  EuiPermissionService,
  I18nService,
  getUserPreferences,
} from '@eui/core';
import { HttpClient } from '@angular/common/http';

import { Observable, zip, of } from 'rxjs';
import { switchMap, skip, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { LangChangeEvent } from '@ngx-translate/core/lib/translate.service';

@Injectable({
  providedIn: 'root',
})
export class AppStarterService {
  defaultUserPreferences: UserPreferences;

  constructor(
    protected userService: UserService,
    protected euiPermissionService: EuiPermissionService,
    protected i18nService: I18nService,
    protected translateService: TranslateService,
    protected store: StoreService,
    @Inject(CONFIG_TOKEN) private config: EuiAppConfig,
    protected http: HttpClient,
  ) {

    this.defaultUserPreferences = this.config.global && this.config.global.user && this.config.global.user.defaultUserPreferences
      ? this.config.global.user.defaultUserPreferences : {};
  }

  start(): Observable<any> {

    return zip(
      this.initUserService().pipe(
        switchMap((userStatus) => {
          if (userStatus.success) {
            // here if userService is successfully created, we use user's pref lang,
            // and init the i18nService
            return this.userService.getState().pipe(
              take(1),
              switchMap((user: UserState) => {
                // initialize the i18n Service based on user's pref language
                return this.i18nService.init({ activeLang: user.preferences && user.preferences.lang });
              }));
          } else {
            return this.i18nService.init();
          }
        }),
      ),
      this.initPermissionService(),
    );
  }

  /**
   * Listen changes for translate service, and update to the user state
   */
  observeLanguageChangesAndUpdateUserPreferences() {
    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.userService.getState().pipe(
        take(1),
      ).subscribe((user: UserState) => {
        this.userService.updateState(
          {
            ...user,
            preferences: {
              ...user.preferences,
              lang: langChangeEvent.lang,
            },
          },
        );
      });
    });
  }

  /**
   * Listen changes for user-pref, and save them
   */
  observeUserPrefChangesAndSavePreferences() {
    this.store.select(getUserPreferences).pipe(skip(1)).subscribe((newPref) => {
      this.saveUserPreferences(newPref).pipe(take(1)).subscribe((res) => {
        console.log(res);
      });
    });
  }

  /**
   * Fetches user details&preferences then merges with the default prefs,
   * create user: UserState object
   * then initialise to the UserService on run time
   */
  initUserService(): Observable<any> {
    return zip(
      this.fetchUserDetails(),
      this.fetchUserPreferences(),
    ).pipe(
      switchMap(([userDetails, userPreferences]) => {

        const user: UserState = {
          ...userDetails,
          preferences: {
            ...this.defaultUserPreferences,
            ...userPreferences,
          },
        };
        return this.userService.init(user);
      }));
  }

  /**
   * Fetches user details&preferences then merges with the default prefs,
   * create user: UserState object
   * then initialise to the UserService on run time
   */
  initPermissionService(): Observable<any> {
    return this.fetchUserRights()
      .pipe(
        switchMap((userRights) => {
          return this.euiPermissionService.init(userRights);
        }));
  }

  /**
   * Fetches user details
   */
  private fetchUserDetails(): Observable<UserDetails> {
    // const url = this.config.modules.your_custom_module.your_custom_endpoint
    const url = new LegacyUserServiceHelper(this.config.modules as LegacyModulesConfig).getEndPoint('details');
    const user = { userId: 'anonymous' };

    if (!url) {
      return of(user);
    }
    return this.http.get<UserDetails>(url);
  }

  /**
   * Fetches user preferences
   */
  private fetchUserPreferences(): Observable<UserPreferences> {
    // const url = this.config.modules.your_custom_module.your_custom_endpoint
    const url = new LegacyUserServiceHelper(this.config.modules as LegacyModulesConfig).getEndPoint('preferences');
    if (!url) {
      return of({});
    }
    return this.http.get<UserPreferences>(url);

  }

  /**
   * Save user preferences by calling the pref endpoint by put method
   */
  private saveUserPreferences(prefs: UserPreferences): Observable<UserPreferences> {
    const url = new LegacyUserServiceHelper(this.config.modules as LegacyModulesConfig).getEndPoint('preferences');
    if (!url) {
      return of({});
    }

    return this.store.select(getUserId).pipe(switchMap(userId => this.http.put<UserPreferences>(`${url}?userId=${userId}`, prefs)));
  }

  /**
   * Fetches user rights
   */
  private fetchUserRights(): Observable<UxUserRight[]> {
    // const url = this.config.modules.your_custom_module.your_custom_endpoint
    const url = new LegacyUserServiceHelper(this.config.modules as LegacyModulesConfig).getEndPoint('rights');

    if (!url) {
      return of([]);
    }
    return this.http.get<UxUserRight[]>(url);
  }
}

export class LegacyUserServiceHelper {
  legacyApiConfig: LegacyUserApiConfig;

  constructor(private modulesConfig: LegacyModulesConfig) {
    this.legacyApiConfig = this.modulesConfig.core && this.modulesConfig.core.api;
  }

  public getEndPoint(target = 'details'): string {

    if (!this.legacyApiConfig || !this.legacyApiConfig.user || !this.legacyApiConfig.user[target]) {
      return;
    }

    const base = this.legacyApiConfig.base || '';
    const baseUser = this.legacyApiConfig.user.base || '';

    if (this.legacyApiConfig.user[target].indexOf('http') > -1) {
      return this.legacyApiConfig.user[target];
    } else {
      return `${base + baseUser + this.legacyApiConfig.user[target]}`;
    }
  }
}

/**
 * Legacy Modules configuration
 */
export interface LegacyModulesConfig {
  core?: LegacyCoreModuleConfig;

  [module: string]: ModuleConfig;
}

/** Removed Core configuration */
export interface LegacyCoreModuleConfig {
  api?: LegacyUserApiConfig;

  [key: string]: any;
}

/** Removed User API configuration */
export interface LegacyUserApiConfig {
  /** general prefix for uri (user uri, etc) */
  base?: string;
  user?: {
    /** prefix for all other user uri (details, preferences, etc) */
    base?: string;
    /** uri for user details (detail was deprecated at 7'th version) */
    details?: string;
    /** uri for user preferences */
    preferences?: string;
    [key: string]: any;
  };

  [key: string]: any;
}
