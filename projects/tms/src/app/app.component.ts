import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { SwUpdate } from '@angular/service-worker';
import { ActivatedRoute, NavigationEnd, Router, Data, Params } from '@angular/router';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { filter, first, map, mergeMap, tap } from 'rxjs/operators';
import {
  AppState,
  CONFIG_TOKEN,
  getUserState,
  getAppState,
  EuiAppConfig,
  I18nService,
  UserService,
  UserState,
  UxAppShellService,
  UxLanguage,
  UxLink
} from '@eui/core';
import { UxLoadingIndicatorComponent, UxModalComponent } from '@eui/components';
import { LicenseManager } from 'ag-grid-enterprise';
import * as _ from 'lodash';
import * as moment_ from 'moment';

const moment = moment_;

import { environment } from '../environments/environment';
import { AppService } from './services/app.service';
import { enApplicationType, UserRole } from './shared/components/models/userProfile.model';
import { CoreService } from './core/services/core.service';
import { GeneralRoutines, ApplicationMessage } from 'tms-library';
import { EventIdDialogComponent } from './shared/components/dialog/event-id-dialog/event-id-dialog.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { enReportType } from './core/components/feedback/feedback.component';
import { AppStarterService } from './app-starter.service';

@Component({
  selector: 'app-root',
  styles: [':host ::ng-deep .inner-content { min-width: 250px; }', ':host ::ng-deep .inner-content>ul { width: 100%; }'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('loading', { static: false }) loading: UxLoadingIndicatorComponent;
  @ViewChild('applicationMessageBox', { static: false }) applicationMessageBox: UxModalComponent;

  userInfos: UserState;
  // Observe state changes
  public userState: Observable<UserState>;
  public appState: Observable<AppState>;
  public activeUserRole: FormControl = new FormControl();

  public menuLinks: UxLink[] = [];  // TMS + Twinning menu
  public notificationLinks: UxLink[] = [];
  public userProfileLinks: UxLink[] = [];
  public appHomeUrl: string = '/tms/events/list';

  public reportBugSettings = {
    title: 'Report a bug',
    description: 'Do you want to download an email template for reporting a bug?',
    feedbackMode: enReportType.Bug,
  };

  public giveFeedbackSettings = {
    title: 'Give a feedback',
    description: 'Do you want to download an email template providing additional feedback?',
    feedbackMode: enReportType.Feedback,
  };

  get menuUserProfileLinks(): UxLink[] {
    return (this.userProfileLinks.length > 0 && this.xsDevice === false) ? this.userProfileLinks : undefined;
  }

  public environment: typeof environment = environment;
  public enApplicationType: typeof enApplicationType = enApplicationType;
  public enReportType: typeof enReportType = enReportType;
  public applicationMessage: ApplicationMessage;
  private loadAppTypeDataSubscription: Subscription;
  private _idSubscription: Subscription;
  private selectedEventSubscription: Subscription;
  private mediaSubscription: Subscription;
  private updateSubscription: Subscription;
  private xsDevice: boolean = false;
  private apiBaseUrl: string;
  private userRoleSubscription: Subscription;

  // Dialog
  private eventIdDialogRef: MatDialogRef<EventIdDialogComponent>;

  constructor(private translateService: TranslateService,
              private store: Store<any>,
              @Inject(CONFIG_TOKEN) private config: EuiAppConfig,
              private i18nService: I18nService,
              private userService: UserService,
              private appStarterService: AppStarterService,
              public titleService: Title, private router: Router,
              private activatedRoute: ActivatedRoute, public appService: AppService, private swUpdate: SwUpdate,
              private shadowDomRoot: ElementRef, public coreService: CoreService, public media: MediaObserver,
              private dialog: MatDialog, public uxAppShellService: UxAppShellService) {
    console.log('App component constructor started: ' + this.titleService.getTitle());
    this.appService.setRouter(this.router).setShadowDomRoot(this.shadowDomRoot);

    this.appStarterService.start().subscribe(([i18nStatus, permissionStatus]) => {
      // if (i18nStatus && i18nStatus.success) {
      //     this.appStarterService.observeLanguageChangesAndUpdateUserPreferences();
      //     this.appStarterService.observeUserPrefChangesAndSavePreferences();
      // }
      this._createNotifications();

      // set userState Observable and subscribe to change userInfos upon updates
      this.userState = <any>this.store.select(getUserState);
      this.appState = <any>this.store.select(getAppState);
    });

    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
    // tslint:disable-next-line:max-line-length
    LicenseManager.setLicenseKey('CompanyName=European Commission DG NEAR,LicensedGroup=MULTI,LicenseType=MultipleApplications,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-014642,ExpiryDate=28_May_2022_[v2]_MTY1MzY5MjQwMDAwMA==791d83d8a1cc92f57d5efd5a7f2538e0');

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map((event) => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data),
        tap<any>((data: Data) => {
          // update page title
          if (data.title) {
            if (data.title.contains('%eventId%') && this.appService.application.selectedEvent) {
              this.titleService.setTitle(enApplicationType[this.appService.application.appType] + ' | ' +
                data.title.replace('%eventId%', this.appService.application.selectedEvent.eventId));
            } else {
              this.titleService.setTitle(enApplicationType[this.appService.application.appType] + ' | ' + data.title);
            }
          } else {
            this.titleService.setTitle(enApplicationType[this.appService.application.appType]);
          }
        })
      )
      .subscribe((event: NavigationEnd) => {
        if (this.appService.application.appType === enApplicationType.TMS) {
          // update menu settings
          this.UpdateTMSMenuLinks();
        }
      });

    this.mediaSubscription = this.media.media$.subscribe((change: MediaChange) => {
      if ((change.mqAlias === 'xs') !== this.xsDevice) {
        this.xsDevice = (change.mqAlias === 'xs');
      }
    });
    this.xsDevice = this.media.isActive('xs');
    this.apiBaseUrl = environment.apiBaseUrl;

    this.userRoleSubscription = this.appService.application.user.activeUserRoleEmitter.subscribe((userRole: UserRole) => {
      // Check if possible to modify user role
      this.activeUserRole.setValue(this.appService.application.user.activeUserRole);
      this.activeUserRole.updateValueAndValidity();
      this.appService.updateActiveUserRole(this.appService.application.user.activeUserRole.userRoleId).subscribe();
    });
  }

  ngOnInit() {
    // check if update available
    if (this.swUpdate.isEnabled) {
      this.updateSubscription = this.swUpdate.available.subscribe(() => {
        if (confirm('New version available. Load New Version?')) {
          window.location.reload();
        }
      });
    }

    this.appState = <any>this.store.select(getAppState);

    this._createNotifications();

    this.loadAppTypeDataSubscription = this.appService.application.appTypeChanged.subscribe((value: enApplicationType) => {
      if (this.appService.application.user.isLoaded && this.appService.application.user.validAccount === true) {
        if (value === enApplicationType.TMS) {
          this.menuLinks = this.createTMSMenuLinks();
          this.activeUserRole.setValue(this.appService.application.user.activeUserRole);
          this.activeUserRole.updateValueAndValidity();
        } else {
          this.createTwinningMenuLinks();
        }
        this.createUserProfileLinks(value);
        this.titleService.setTitle(enApplicationType[value]);
      } else {
        this.menuLinks = [];
        this.userProfileLinks = [];
      }
    });

    this.selectedEventSubscription = this.appService.application.selectedEventChanged.subscribe((value: any) => {
      if (this.titleService.getTitle().contains('%eventId%') && value) {
        this.titleService.setTitle(this.titleService.getTitle().replace('%eventId%', value.eventId));
      }
      this.UpdateTMSMenuLinks();
    });

    // load initial settings
    const qlikViewUrl = this.appService.getQlikViewUrl();
    const qlikReportsUrl = this.appService.getQlikReportsUrl();
    const applicationMessage = this.appService.getApplicationMessage();
    forkJoin([qlikViewUrl, qlikReportsUrl, applicationMessage]).pipe(first()).subscribe(
      (res: Array<any>) => {
        this.appService.application.qlikViewUrl = res[0];
        this.appService.application.qlikReports = res[1];
        this.applicationMessage = res[2];

        if (this.applicationMessage &&
            this.applicationMessage != null &&
            this.applicationMessage.enabled === true &&
            moment.utc().isBetween(this.applicationMessage.startDate, this.applicationMessage.endDate) &&
            this.applicationMessage.loadLastDisplayed().isBefore(moment.utc(), 'day')) {
          this.uxAppShellService.openModal('applicationMessageBox');
          this.applicationMessage.storeLastDisplayed();
        }
      },
      errMsg => {
        console.error('Loading application settings failed - ' + errMsg);
      });

    // intercept user role changes
    this.activeUserRole.valueChanges
      .subscribe((value: UserRole) => {
        // only check if the role is different
        if (this.appService.application.user.activeUserRole !== value) {
          this.appService.application.user.activeUserRole = value;
        }
      });
  }

  ngOnDestroy() {
    if (this._idSubscription) {
      this._idSubscription.unsubscribe();
    }
    if (this.loadAppTypeDataSubscription) {
      this.loadAppTypeDataSubscription.unsubscribe();
    }
    if (this.selectedEventSubscription) {
      this.selectedEventSubscription.unsubscribe();
    }
    if (this.mediaSubscription) {
      this.mediaSubscription.unsubscribe();
    }
    if (this.userRoleSubscription) {
      this.userRoleSubscription.unsubscribe();
    }
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  onLanguageChanged(language: UxLanguage) {
    this.translateService.use(language.code);
  }

  onUserProfileLinkSelected(uxLink: UxLink): void {
    // uxLink.command();
    switch (uxLink.id) {
    case 'startTMS':
      this.startTMS();
      break;
    case 'startTwinning':
      this.startTwinning();
      break;
    case 'myProfile':
      this.coreService.userProfileToggle();
      break;
    case 'preferences':
      this.coreService.userPreferencesToggle();
      break;
    case 'about':
      this.coreService.aboutToggle();
      break;
    case 'feedback':
      this.coreService.feedbackToolToggle();
      break;
    case 'changePassword':
      this.onChangePassword();
      break;
    case 'logout':
      this.onLogout();
      break;
    }
  }

  public onLogin($event): void {
    this.appService.application.logIn().subscribe((result) => {
      if (this.appService.application.appType === enApplicationType.Twinning) {
        this.router.navigate(['/twinning/twinninglist']);
      } else {
        this.router.navigate(['/tms/dashboard']);
      }
    });
  }

  public onChangePassword(): void {
    window.open(GeneralRoutines.getAbsolutePath() + '/cas/change/changePassword.cgi', '_blank');
  }

  public onLogout(): void {
    this.appService.logoutFromTms().subscribe((data: any) => {
      window.open(GeneralRoutines.getAbsolutePath(environment.oldTMSUrl) + 'jobcardInit?logoutOfEULogin=1', '_self');
    });
  }

  public startTMS(): void {
    this.appService.application.appType = enApplicationType.TMS;
    this.router.navigate(['/tms/dashboard']);
  }

  public startTwinning(): void {
    this.appService.application.appType = enApplicationType.Twinning;
    this.router.navigate(['/twinning/twinninglist']);
  }

  public hasTMSApplication(): boolean {
    return this.appService.application.user.hasApplication(enApplicationType.TMS);
  }

  public hasTwinningApplication(): boolean {
    return this.appService.application.user.hasApplication(enApplicationType.Twinning);
  }

  public btnGetDocument(documentId: number): void {
    window.location.assign(this.apiBaseUrl + this.appService.application.appTypeString + '/getDocument?id=' + documentId);
  }

  public btnApplicationFormCreate(): void {
    window.open(GeneralRoutines.getAbsolutePath(environment.webRestrictUrl) + 'resources/js/app/#/applicationform/detail/'
      + this.appService.application.user.encryptedUserId, '_blank');
  }

  public btnApplicationFormList(): void {
    window.open(GeneralRoutines.getAbsolutePath(environment.webRestrictUrl) + 'resources/js/app/#/applicationform/list/'
      + this.appService.application.user.encryptedUserId, '_blank');
  }

  private createTMSMenuLinks(): UxLink[] {
    let menuLinks = [
      new UxLink(
        {
          label: 'Dashboard',
          url: '/tms/dashboard',
          visible: this.appService.hasAction('lnk_dashboard')
        }
      ),
      new UxLink(
        {
          label: 'Tasks',
          url: '/tms/tasks',
          command: () => this.router.navigate(['/tms/tasks/list']),
          visible: this.appService.hasAction('lnk_task_list')
        }
      ),
      new UxLink(
        {
          label: 'Events',
          url: '/tms/events',
          command: () => this.router.navigate(['/tms/events/list']),
          visible: this.appService.hasAction('lnk_events_list')
        }
      ),
      new UxLink(
        {
          label: 'List',
          url: undefined,
          visible: this.appService.hasAnyAction(['lnk_keycontact_list', 'lnk_person_list', 'lnk_supplier_list']),
          children: [
            new UxLink({
              label: 'Key Contacts',
              url: '/tms/list/keycontact/list',
              visible: this.appService.hasAction('lnk_keycontact_list')
            }),
            new UxLink({
              label: 'Persons',
              url: '/tms/list/person/list',
              visible: this.appService.hasAction('lnk_person_list')
            }),
            new UxLink({
              label: 'Suppliers and Institutions',
              url: '/tms/list/supplier/list',
              visible: this.appService.hasAction('lnk_supplier_list')
            })
          ]
        }
      ),
      new UxLink(
        {
          id: 'financial',
          label: 'Financial',
          url: undefined,
          visible: this.appService.hasAnyAction(['lnk_budget_contracts_modify', 'lnk_budget_contracts_read', 'lnk_invoice_budget_contract_modify',
            'lnk_invoice_budget_contracts_read', 'lnk_invoices_modify', 'lnk_invoices_read', 'btn_forecast_modify', 'lnk_forecast_read',
            'lnk_reimbursable_sheet', 'lnk_account_report', 'lnk_financial_vat', 'btn_forecast_modify', 'lnk_forecast_read']),
          children: [
            new UxLink({
              label: 'IBU',
              url: undefined,
              visible: this.appService.hasAnyAction(['lnk_budget_contracts_modify', 'lnk_budget_contracts_read', 'lnk_invoice_budget_contract_modify',
                'lnk_invoice_budget_contracts_read', 'lnk_invoices_modify', 'lnk_invoices_read']),
              children: [
                new UxLink({
                  label: 'Budgetary Commitments',
                  url: '/tms/financial/ibu/budgetContracts',
                  visible: this.appService.hasAnyAction(['lnk_budget_contracts_modify', 'lnk_budget_contracts_read'])
                }),
                new UxLink({
                  label: 'Invoice Budgetary Commitment',
                  url: '/tms/financial/ibu/invoiceBudgetContract',
                  visible: this.appService.hasAnyAction(['lnk_invoice_budget_contract_modify', 'lnk_invoice_budget_contracts_read'])
                }),
                new UxLink({
                  label: 'Invoices',
                  url: '/tms/financial/ibu/invoices',
                  visible: this.appService.hasAnyAction(['lnk_invoices_modify', 'lnk_invoices_read'])
                }),
                new UxLink({
                  label: 'Forecast',
                  url: '/tms/financial/ibu/forecast',
                  visible: this.appService.hasAnyAction(['btn_forecast_modify', 'lnk_forecast_read'])
                })
              ]
            }),
            new UxLink({
              label: 'Contractor',
              url: undefined,
              visible: this.appService.hasAnyAction(['lnk_reimbursable_sheet', 'lnk_account_report', 'lnk_financial_vat', 'lnk_payment_file']),
              children: [
                new UxLink({
                  label: 'Reimbursable Sheet',
                  command: () => this.btnOpenURL('reimbursable.do?dispatch=Reset', 'Financial'),
                  visible: this.appService.hasAction('lnk_reimbursable_sheet')
                }),
                new UxLink({
                  label: 'Payment File',
                  command: () => this.btnExtractPaymentFile(),
                  visible: this.appService.hasAction('lnk_payment_file'),
                  disabled: GeneralRoutines.isNullOrUndefined(this.appService.application.selectedEvent?.paymentFileURL)
                }),
                new UxLink({
                  label: 'Expenditure Report',
                  command: () => this.btnExpenditureReport(),
                  visible: this.appService.hasAction('lnk_account_report')
                }),
                new UxLink({
                  label: 'Request Budgetline Calculation',
                  command: () => this.btnOpenURL('budget/account_report.jsp', 'Financial'),
                  visible: this.appService.hasAction('lnk_account_report')
                }),
                new UxLink({
                  label: 'VAT Report',
                  command: () => this.btnOpenURL('financialReport.do?dispatch=Print', 'Financial'),
                  visible: this.appService.hasAction('lnk_financial_vat')
                })
              ]
            })
          ]
        }
      ),
      new UxLink(
        {
          label: 'Statistics',
          url: undefined,
          visible: this.appService.hasAnyAction(['menu_statistic', 'menu_statistic_cost', 'lnk_budget_management',
            'menu_statistic_IBU', 'lnk_qv_tab_evaluation', 'lnk_qv_tab_edb_dashboard', 'lnk_qv_tab_financial_dashboard',
            'lnk_qv_tab_tms_overview']),
          children: [
            new UxLink({
              label: 'Qlik reports',
              url: undefined,
              visible: this.appService.hasAnyAction(['lnk_qv_tab_evaluation', 'lnk_qv_tab_edb_dashboard',
                'lnk_qv_tab_financial_dashboard', 'lnk_qv_tab_tms_overview']),
              children: [
                new UxLink({
                  label: 'Evaluation overview',
                  command: () => window.open(this.appService.application.qlikReports.qlikEvaluationURL, '_blank'),
                  visible: this.appService.application.qlikReports?.qlikEvaluationURL !== '' && this.appService.hasAction('lnk_qv_tab_evaluation'),
                }),
                new UxLink({
                  label: 'Experts dashboard',
                  command: () => window.open(this.appService.application.qlikReports.qlikEDBURL, '_blank'),
                  visible: this.appService.application.qlikReports?.qlikEDBURL !== '' && this.appService.hasAction('lnk_qv_tab_edb_dashboard'),
                }),
                new UxLink({
                  label: 'Financial dashboard',
                  command: () => window.open(this.appService.application.qlikReports.qlikFinancialURL, '_blank'),
                  visible: this.appService.application.qlikReports?.qlikFinancialURL !== '' && this.appService.hasAction('lnk_qv_tab_financial_dashboard'),
                }),
                new UxLink({
                  label: 'TMS overview',
                  command: () => window.open(this.appService.application.qlikReports.qlikTMSOverviewURL, '_blank'),
                  visible: this.appService.application.qlikReports?.qlikTMSOverviewURL !== '' && this.appService.hasAction('lnk_qv_tab_tms_overview'),
                })
              ]
            }),
            new UxLink({
              label: 'General statistics',
              url: undefined,
              visible: this.appService.hasAnyAction(['menu_statistic', 'menu_statistic_cost', 'lnk_budget_management', 'menu_statistic_IBU']),
              children: [
                new UxLink({
                  label: 'Task details',
                  url: '/tms/statistics/general/taskdetails/1',
                  visible: this.appService.hasAction('menu_statistic_IBU')
                }),
                new UxLink({
                  label: 'Event details',
                  url: '/tms/statistics/general/eventdetails/2',
                  visible: this.appService.hasAction('menu_statistic')
                }),
                new UxLink({
                  label: 'Events planned',
                  url: '/tms/statistics/general/eventsplanned/3',
                  visible: this.appService.hasAction('menu_statistic')
                }),
                new UxLink({
                  label: 'Events workflow',
                  url: '/tms/statistics/general/eventsworkflow/8',
                  visible: this.appService.hasAction('menu_statistic')
                }),
                new UxLink({
                  label: 'Event cost per country',
                  url: '/tms/statistics/general/eventcostcountry/4',
                  visible: this.appService.hasAction('menu_statistic_cost')
                }),
                new UxLink({
                  label: 'Event cost per event',
                  url: '/tms/statistics/general/eventcostevent/5',
                  visible: this.appService.hasAction('menu_statistic_cost')
                }),
                new UxLink({
                  label: 'Event status',
                  url: '/tms/statistics/general/eventstatus/12',
                  visible: this.appService.hasAction('menu_statistic')
                }),
                new UxLink({
                  label: 'Participant/Expert details',
                  url: '/tms/statistics/general/partdetails/6',
                  visible: this.appService.hasAction('menu_statistic')
                }),
                new UxLink({
                  label: 'Flight cost',
                  url: '/tms/statistics/general/flightcost/7',
                  visible: this.appService.hasAction('menu_statistic_cost')
                }),
                new UxLink({
                  label: 'Commitments by event',
                  url: '/tms/statistics/general/commbyevent/10',
                  visible: this.appService.hasAction('lnk_budget_management')
                }),
                new UxLink({
                  label: 'Commitments by event/country',
                  url: '/tms/statistics/general/commbycountry/11',
                  visible: this.appService.hasAction('lnk_budget_management')
                })
              ]
            }),
            new UxLink({
              label: 'Reports',
              url: undefined,
              visible: this.appService.hasAction('menu_statistic'),
              children: [
                new UxLink({
                  label: 'Event by subject',
                  url: '/tms/statistics/reports/eventbysubject/21',
                  visible: true
                })
              ]
            }),
            new UxLink({
              label: 'Logistics statistics',
              url: undefined,
              visible: this.appService.hasAction('menu_statistic'),
              children: [
                new UxLink({
                  label: 'Meeting planning',
                  url: '/tms/statistics/logistics/meetingplanning/31',
                  visible: true
                }),
                new UxLink({
                  label: 'Accommodation',
                  url: '/tms/statistics/logistics/accommodation/32',
                  visible: true
                }),
                new UxLink({
                  label: 'Catering',
                  url: '/tms/statistics/logistics/catering/33',
                  visible: true
                }),
                new UxLink({
                  label: 'Conference',
                  url: '/tms/statistics/logistics/conference/34',
                  visible: true
                }),
                new UxLink({
                  label: 'Interpretation',
                  url: '/tms/statistics/logistics/interpretation/9',
                  visible: true
                }),
                new UxLink({
                  label: 'LVS',
                  url: '/tms/statistics/logistics/lvs/35',
                  visible: true
                })
              ]
            })
          ]
        }
      ),
      new UxLink(
        {
          label: 'Application Form',
          url: undefined,
          visible: this.appService.hasAction('menu_application_form'),
          children: [
            new UxLink({
              label: 'Create new',
              command: () => this.btnApplicationFormCreate(),
              visible: true
            }),
            new UxLink({
              label: 'Get my list',
              command: () => this.btnApplicationFormList(),
              visible: true
            })
          ]
        }
      ),
      new UxLink(
        {
          label: 'Other',
          url: undefined,
          visible: this.appService.hasAnyAction(['lnk_amadeus', 'btn_web_folder', 'lnk_ibuadministration_city', 'lnk_ibuadministration_general',
            'lnk_ibuadministration_dsa', 'lnk_consult_dsa', 'lnk_administration_users', 'lnk_administration_actions', 'lnk_administration_roles',
            'lnk_administration_actionroles', 'lnk_administration_appsettings', 'lnk_administration_project', 'lnk_administration_mailingrecipients',
            'lnk_administration_eventtype', 'lnk_administration_paymenttransferrate', 'lnk_application_form_online', 'lnk_administration_statistics_jobs']),
          children: [
            new UxLink({
              label: 'Amadeus',
              url: '/tms/other/amadeus',
              visible: this.appService.hasAction('lnk_amadeus')
            }),
            new UxLink({
              label: 'Administration',
              url: undefined,
              visible: this.appService.hasAnyAction(['lnk_ibuadministration_city', 'lnk_ibuadministration_general', 'lnk_ibuadministration_dsa',
                'lnk_consult_dsa', 'lnk_administration_users', 'lnk_administration_actions', 'lnk_administration_roles', 'lnk_administration_actionroles',
                'lnk_administration_appsettings', 'lnk_administration_project', 'lnk_administration_mailingrecipients', 'lnk_administration_eventtype',
                'lnk_administration_paymenttransferrate', 'lnk_application_form_online', 'lnk_administration_statistics_jobs']),
              children: [
                new UxLink({
                  label: 'City list',
                  url: '/tms/other/administration/ibuadministrator/citylist',
                  visible: this.appService.hasAction('lnk_ibuadministration_city')
                }),
                new UxLink({
                  label: 'General',
                  url: '/tms/other/administration/ibuadministrator/general',
                  visible: this.appService.hasAction('lnk_ibuadministration_general')
                }),
                new UxLink({
                  label: 'DSA Rates',
                  url: '/tms/other/administration/ibuadministrator/dsa/list',
                  visible: this.appService.hasAnyAction(['lnk_ibuadministration_dsa', 'lnk_consult_dsa'])
                }),
                new UxLink({
                  label: 'Application forms',
                  url: '/tms/other/administration/ibuadministrator/applicationForms',
                  visible: this.appService.hasAction('lnk_application_form_online')
                }),
                new UxLink({
                  isSeparator: true,
                  visible: this.appService.hasAnyAction(['lnk_ibuadministration_city', 'lnk_ibuadministration_general', 'lnk_ibuadministration_dsa',
                    'lnk_consult_dsa', 'lnk_application_form_online']) && this.appService.hasAction('lnk_administration_users')
                }),
                new UxLink({
                  label: 'User list',
                  url: '/tms/other/administration/admin/user/list',
                  visible: this.appService.hasAction('lnk_administration_users')
                }),
                new UxLink({
                  isSeparator: true,
                  visible: this.appService.hasAction('lnk_administration_users') && this.appService.hasAnyAction(['lnk_administration_actions',
                    'lnk_administration_roles', 'lnk_administration_actionroles', 'lnk_administration_appsettings', 'lnk_administration_project',
                    'lnk_administration_mailingrecipients', 'lnk_administration_eventtype', 'lnk_administration_paymenttransferrate'])
                }),
                new UxLink({
                  label: 'Action list',
                  url: '/tms/other/administration/administrator/action/list',
                  visible: this.appService.hasAction('lnk_administration_actions')
                }),
                new UxLink({
                  label: 'Role list',
                  url: '/tms/other/administration/administrator/role/list',
                  visible: this.appService.hasAction('lnk_administration_roles')
                }),
                new UxLink({
                  label: 'Action Role list',
                  url: '/tms/other/administration/administrator/actionrole/list',
                  visible: this.appService.hasAction('lnk_administration_actionroles')
                }),
                new UxLink({
                  label: 'Application settings',
                  url: '/tms/other/administration/administrator/appsettings/list',
                  visible: this.appService.hasAction('lnk_administration_appsettings')
                }),
                new UxLink({
                  label: 'Projects',
                  url: '/tms/other/administration/administrator/project/list',
                  visible: this.appService.hasAction('lnk_administration_project')
                }),
                new UxLink({
                  label: 'Mailing recipients',
                  url: '/tms/other/administration/administrator/mailingrecipients/list',
                  visible: this.appService.hasAction('lnk_administration_mailingrecipients')
                }),
                new UxLink({
                  label: 'Event Type',
                  url: '/tms/other/administration/administrator/eventtype/list',
                  visible: this.appService.hasAction('lnk_administration_eventtype')
                }),
                new UxLink({
                  label: 'Statistics Jobs',
                  url: '/tms/other/administration/administrator/statistics-jobs',
                  visible: this.appService.hasAction('lnk_administration_statistics_jobs')
                }),
                new UxLink({
                  label: 'Payment Transfer Rates',
                  url: '/tms/other/administration/administrator/paymenttransferrate/list',
                  visible: this.appService.hasAction('lnk_administration_paymenttransferrate') && environment.production === false
                }),
                new UxLink({
                  label: 'Audit logs',
                  visible: environment.production === false
                })
              ]
            }),
            new UxLink({
              label: 'PAX Registration Tool',
              url: undefined,
              visible: this.appService.hasAction('menu_pax_registration_tool'),
              children: [
                new UxLink({
                  label: 'Normal',
                  command: () => this.btnPAXRegistrationTool(146),
                  visible: this.appService.hasAction('menu_pax_registration_tool')
                }),
                new UxLink({
                  label: 'Short (VTC..)',
                  command: () => this.btnPAXRegistrationTool(210),
                  visible: this.appService.hasAction('menu_pax_registration_tool')
                })
              ]
            }),
            new UxLink({
              label: 'Windows Folder',
              command: () => this.btnWindowsFolder(),
              visible: this.appService.hasAction('btn_web_folder')
            })
          ]
        }
      ),
      new UxLink(
        {
          id: 'eventDocuments',
          label: 'Documents',
          url: undefined,
          visible: false,
          children: [
            new UxLink({
              label: 'AF-OF',
              url: undefined,
              visible: this.appService.hasAction('lnk_events_eventsdocuments_afof'),
              children: [
                new UxLink({
                  label: 'Authorisation Form',
                  url: '/tms/events/eventdocuments/afof/AF/1'
                }),
                new UxLink({
                  label: 'Order Form',
                  url: '/tms/events/eventdocuments/afof/OF/2'
                }),
                new UxLink({
                  label: 'Order Form Appendix',
                  url: '/tms/events/eventdocuments/afof/OFAppx/3'
                })
              ]
            }),
            new UxLink({
              label: 'IBU',
              url: undefined,
              visible: this.appService.hasAnyAction(['lnk_events_eventsdocuments_ibu', 'lnk_events_eventsdocuments_contractor']),
              children: [
                new UxLink({
                  id: 'eventDocumentsAgenda',
                  label: 'Agenda',
                  url: undefined,
                  visible: this.appService.hasAnyAction(['lnk_events_eventsdocuments_ibu', 'lnk_events_eventsdocuments_contractor'])
                }),
                new UxLink({
                  id: 'eventDocumentsPresentations',
                  label: 'Presentations',
                  url: undefined,
                  visible: this.appService.hasAction('lnk_events_eventsdocuments_ibu')
                }),
                new UxLink({
                  id: 'eventDocumentsInvitation',
                  label: 'Invitation',
                  url: undefined,
                  visible: this.appService.hasAction('lnk_events_eventsdocuments_ibu')
                }),
                new UxLink({
                  label: 'Send Reports',
                  url: '/tms/events/eventdocuments/ibu/sendreports/4',
                  visible: this.appService.hasAction('lnk_events_eventsdocuments_ibu')
                }),
                new UxLink({
                  label: 'Evaluation',
                  url: '/tms/events/eventdocuments/ibu/evaluation/5',
                  visible: this.appService.hasAction('lnk_events_eventsdocuments_ibu')
                }),
                new UxLink({
                  label: 'Evaluation - Impact feedback',
                  command: () => this.btnImpactFeedbackResult(),
                  visible: this.appService.hasAction('lnk_events_eventsdocuments_ibu'),
                  disabled: GeneralRoutines.isNullOrUndefined(this.appService.application.selectedEvent?.evaluationImpactFeedbackResultURL)
                })
              ]
            }),
            new UxLink({
              label: 'Contractor',
              url: undefined,
              visible: this.appService.hasAnyAction(['lnk_events_eventsdocuments_ibu', 'lnk_events_eventsdocuments_contractor']),
              children: [
                new UxLink({
                  label: 'Participant Confirmation',
                  command: () => this.router.navigate(['/tms/events/eventdocuments/contractor/participant-confirmation',
                    this.appService.application.selectedEvent.eventId])
                }),
                new UxLink({
                  label: 'Confirmation for Supplier',
                  url: '/tms/events/eventdocuments/contractor/supplierconfirmation/2'
                }),
                new UxLink({
                  label: 'Option for Supplier',
                  url: '/tms/events/eventdocuments/contractor/supplieroption/3'
                }),
                new UxLink({
                  label: 'Supplier Confirmation (XLSX)',
                  url: '/tms/events/eventdocuments/contractor/supplierconfirmationXLSX/4'
                }),
                new UxLink({
                  label: 'Expert-Interpreter-LVS',
                  url: '/tms/events/eventdocuments/contractor/expertlvsinterpreter/5'
                }),
                new UxLink({
                  label: 'Checklist',
                  command: () => this.router.navigate(['/tms/events/eventdocuments/contractor/checklist', this.appService.application.selectedEvent.eventId])
                })
              ]
            }),
            new UxLink({
              label: 'List',
              url: undefined,
              visible: this.appService.hasAction('lnk_events_eventsdocuments_list'),
              children: [
                new UxLink({
                  label: 'Participants',
                  url: '/tms/events/eventdocuments/list/participant/1'
                }),
                new UxLink({
                  label: 'Attendance',
                  url: '/tms/events/eventdocuments/list/attendance/2'
                }),
                new UxLink({
                  label: 'Accomodations',
                  url: '/tms/events/eventdocuments/list/accommodations/3'
                }),
                new UxLink({
                  label: 'Travels',
                  url: '/tms/events/eventdocuments/list/travellers/4'
                }),
                new UxLink({
                  label: 'Travellers Report',
                  url: '/tms/events/eventdocuments/list/travellersReport/5'
                })
              ]
            })
          ]
        }
      ),
      new UxLink(
        {
          id: 'eventMaterial',
          label: 'Material',
          url: undefined,
          visible: false,
          children: [
            new UxLink({
              label: 'Person labels',
              command: () => this.router.navigate(['/tms/events/eventmaterial/labels', this.appService.application.selectedEvent.eventId])
            }),
            new UxLink({
              label: 'Country chevalets',
              command: () => this.router.navigate(['/tms/events/eventmaterial/countrychevalets', this.appService.application.selectedEvent.eventId])
            })
          ]
        }
      )
    ];
    this.appHomeUrl = '/tms/events/list';
    return menuLinks;
  }

  private createTwinningMenuLinks() {
    this.menuLinks = [
      new UxLink(
        {
          label: 'Twinning',
          url: '/twinning/twinninglist',
          command: () => this.router.navigate(['/twinning/twinninglist'])
        }
      ),
      new UxLink(
        {
          label: 'List',
          url: undefined,
          visible: this.appService.hasAnyAction(['lnk_keycontact_list', 'lnk_person_list', 'lnk_supplier_list', 'lnk_financialdecision_list']),
          children: [
            new UxLink({
              label: 'Key Contacts',
              url: '/twinning/list/keycontact',
              visible: this.appService.hasAction('lnk_keycontact_list'),
              command: () => this.router.navigate(['/twinning/list/keycontact/list'])
            }),
            new UxLink({
              label: 'Persons',
              url: '/twinning/list/person',
              visible: this.appService.hasAction('lnk_person_list'),
              command: () => this.router.navigate(['/twinning/list/person/list'])
            }),
            new UxLink({
              label: 'Institutions and mandated bodies',
              url: '/twinning/list/supplier',
              visible: this.appService.hasAction('lnk_supplier_list'),
              command: () => this.router.navigate(['/twinning/list/supplier/list'])
            }),
            new UxLink({
              label: 'Financing decisions',
              url: '/twinning/list/financialdecisionlist',
              visible: this.appService.hasAction('lnk_financialdecision_list')
            })
          ]
        }
      ),
      new UxLink(
        {
          label: 'Statistics',
          command: () => this.btnTwinningStatistics(),
          visible: this.appService.application.qlikReports?.qlikTwinningURL !== '' && this.appService.hasAction('lnk_twinning_statistics')
        }
      )
    ];
    this.appHomeUrl = '/twinning/twinninglist';
  }

  private createUserProfileLinks(appType: enApplicationType) {
    this.userProfileLinks = [
      new UxLink(
        {
          label: 'My settings', iconClass: 'icon-action-item fa fa-sliders',
          command: () => {
            this.coreService.userSettingsToggle();
          }
        }
      ),
      new UxLink(
        {
          label: 'My profile', iconClass: 'icon-action-item fa fa-user',
          command: () => this.coreService.userProfileToggle()
        }
      ),
      new UxLink(
        {
          label: 'Preferences', iconClass: 'icon-action-item fa fa-cog',
          command: () => this.coreService.userPreferencesToggle()
        }
      ),
      new UxLink(
        {
          label: 'Change password', iconClass: 'icon-action-item fa fa-key',
          command: () => this.onChangePassword()
        }
      ),
      new UxLink(
        {
          label: 'Logout', iconClass: 'icon-action-item fa fa-sign-out',
          command: () => this.onLogout()
        }
      )
    ];

    // check if tms or twinning
    if (appType === enApplicationType.TMS) {
      this.userProfileLinks.insert(0, new UxLink(
        {
          label: 'Twinning', iconClass: 'icon-action-item fa fa-desktop',
          command: () => { this.startTwinning(); }
        }
      ));
    } else {
      this.userProfileLinks.insert(0, new UxLink(
        {
          label: 'TMS', iconClass: 'icon-action-item fa fa-desktop',
          command: () => { this.startTMS(); }
        }
      ));
    }
  }

  private _createNotifications() {
    this.notificationLinks = [
/*      new UxLink(
        { label: 'Notification title', subLabel: 'This is the description of the noficiation' }
      ),
      new UxLink(
        { label: 'Notification title', subLabel: 'This is the description of the noficiation' }
      ),
      new UxLink(
        { label: 'Notification title', subLabel: 'This is the description of the noficiation' }
      ),*/
    ];
  }

  private btnWindowsFolder(): void {
    window.open('/Twinning/' + 'accessFolder/mapWebDrive/', '_parent');
  }

  private btnTwinningStatistics(): void {
    window.open(this.appService.application.qlikReports.qlikTwinningURL, '_blank');
  }

  private btnImpactFeedbackResult(): void {
    if (!GeneralRoutines.isNullOrUndefined(this.appService.application.selectedEvent?.evaluationImpactFeedbackResultURL)) {
      window.open(this.appService.application.selectedEvent.evaluationImpactFeedbackResultURL, '_blank');
    }
  }

  private btnPAXRegistrationTool(templateId: number): void {
    window.open(GeneralRoutines.getAbsolutePath(environment.webRestrictUrl) + 'publicDocument?id=' + templateId, '_blank');
  }

  private btnOpenURL(url: string, target: string) {
    window.open(GeneralRoutines.getAbsolutePath(environment.oldTMSUrl) + url, target);
  }

  private btnExtractPaymentFile(): void {
    if (!GeneralRoutines.isNullOrUndefined(this.appService.application.selectedEvent?.paymentFileURL)) {
      window.open(this.appService.application.selectedEvent.paymentFileURL, '_blank');
    }
  }

  private btnExpenditureReport(): void {
    // 1. Create dialog
    this.eventIdDialogRef = this.dialog.open(EventIdDialogComponent, { disableClose: false } as MatDialogConfig);
    // 2. Assign available quarters
    this.eventIdDialogRef.componentInstance.title = 'Expenditure Report';
    this.eventIdDialogRef.componentInstance.caption = 'Mother Event ID';
    this.eventIdDialogRef.componentInstance.placeholder = 'event ID';
    // 3. subscribe to return value
    this.eventIdDialogRef.afterClosed().subscribe(eventId => {
      this.eventIdDialogRef = null;
      // 4. Check if Sign button was clicked
      if (eventId !== undefined) {
        window.open('/Twinning/api/docs/account/7/' + eventId, '_blank');
      }
    });
  }

  private UpdateTMSMenuLinks(): void {
    let menuLinks = this.createTMSMenuLinks();
    let financial: UxLink = _.find(menuLinks, ['id', 'financial']);
    let eventMaterial: UxLink = _.find(menuLinks, ['id', 'eventMaterial']);
    let eventDocuments: UxLink = _.find(menuLinks, ['id', 'eventDocuments']);
    if (eventMaterial && eventDocuments && financial) {
      let paymentFile: UxLink = financial.children[1].children[1];
      if (this.appService.application.selectedEvent) {
        let eventDocumentsAgenda: UxLink = eventDocuments.children[1].children[0];
        let eventDocumentsPresentations: UxLink = eventDocuments.children[1].children[1];
        let eventDocumentsInvitation: UxLink = eventDocuments.children[1].children[2];
        let eventDocumentsImpactFeedback: UxLink = eventDocuments.children[1].children[5];
        let eventDocumentsSupplierConfirmation: UxLink = eventDocuments.children[2].children[1];
        let eventDocumentsSupplierOption: UxLink = eventDocuments.children[2].children[2];
        let eventDocumentsExpertLVSInterpreter: UxLink = eventDocuments.children[2].children[4];
        let eventDocumentsChecklist: UxLink = eventDocuments.children[2].children[5];
        eventMaterial.visible = this.appService.hasAction('lnk_events_eventsmaterial') && (this.appService.isRouteActive(['/tms/events/list']) ||
          this.appService.isRouteActive(['/tms/events/detail']) || this.appService.isRouteActive(['/tms/events/eventmaterial'])) &&
          this.appService.application.selectedEvent !== undefined;
        eventDocuments.visible = this.appService.hasAnyAction(['lnk_events_eventsdocuments_afof',
          'lnk_events_eventsdocuments_ibu', 'lnk_events_eventsdocuments_contractor', 'lnk_events_eventsdocuments_list']) &&
          (this.appService.isRouteActive(['/tms/events/list']) ||
            this.appService.isRouteActive(['/tms/events/detail']) ||
            this.appService.isRouteActive(['/tms/events/eventdocuments'])) &&
          this.appService.application.selectedEvent !== undefined;
        eventDocumentsAgenda.url = this.getAgendaRoute();
        eventDocumentsPresentations.url = '/tms/events/eventdocuments/ibu/presentations/' + this.appService.application.selectedEvent.motherEventId;
        eventDocumentsInvitation.url = '/tms/events/eventdocuments/ibu/invitation/' + this.appService.application.selectedEvent.motherEventId + '/' +
          this.appService.application.selectedEvent.eventId;
        eventDocumentsImpactFeedback.disabled = GeneralRoutines.isNullOrUndefined(this.appService.application.selectedEvent?.evaluationImpactFeedbackResultURL);
        // disable the following links to keep referring to the old interface
        eventDocumentsSupplierConfirmation.url = '/tms/events/eventdocuments/contractor/supplier/1/' +
          this.appService.application.selectedEvent.eventId;
        eventDocumentsSupplierOption.url = '/tms/events/eventdocuments/contractor/supplier/2/' +
          this.appService.application.selectedEvent.eventId;
        eventDocumentsExpertLVSInterpreter.url = '/tms/events/eventdocuments/contractor/expertlvsinterpreter/' +
          this.appService.application.selectedEvent.eventId;
        paymentFile.disabled = GeneralRoutines.isNullOrUndefined(this.appService.application.selectedEvent?.paymentFileURL);
      } else {
        eventMaterial.visible = this.appService.hasAction('lnk_events_eventsmaterial') && (this.appService.isRouteActive(['/tms/events/list']) ||
          this.appService.isRouteActive(['/tms/events/detail']) || this.appService.isRouteActive(['/tms/events/eventmaterial'])) &&
          this.appService.application.selectedEvent !== undefined;
        eventDocuments.visible = this.appService.hasAnyAction(['lnk_events_eventsdocuments_afof',
          'lnk_events_eventsdocuments_ibu', 'lnk_events_eventsdocuments_contractor', 'lnk_events_eventsdocuments_list']) &&
          (this.appService.isRouteActive(['/tms/events/list']) ||
            this.appService.isRouteActive(['/tms/events/detail']) ||
            this.appService.isRouteActive(['/tms/events/eventdocuments'])) &&
          this.appService.application.selectedEvent !== undefined;
        paymentFile.disabled = true;
      }
    }

    this.uxAppShellService.setState({
      ...this.uxAppShellService.state,
      menuLinks: menuLinks,
    });
  }

  private getAgendaRoute(): string {
    let url = '';
    // IBU Admin with access writes or IBU user and event not OF signed
    if (this.appService.application.selectedEvent &&
      (this.appService.hasAction('btn_agenda_upload') ||
        (this.appService.hasAction('lnk_events_eventsdocuments_ibu') &&
          this.appService.application.selectedEvent.ofStatus !== 'Y' &&
          this.appService.application.selectedEvent.ofStatus !== 'R'))) {
      url = '/tms/events/eventdocuments/ibu/agenda/' + this.appService.application.selectedEvent.motherEventId;
    } else {
      url = '/tms/events/eventdocuments/ibu/agenda/document/1';
    }
    return url;
  }
}
