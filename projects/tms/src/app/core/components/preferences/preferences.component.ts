import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

import * as moment from 'moment';
import { getUserState, UpdateUserPreferencesAction, getUserPreferences, markFormGroupTouched } from '@eui/core';
import { UxAppShellService, UxTimezoneService } from '@eui/core';
import { take } from 'rxjs/operators';
import { CoreService } from '../../services/core.service';
import { Preferences } from '../shared/preferences.model';

@Component({
  selector: 'app-core-user-preferences',
  templateUrl: './preferences.component.html',
  providers: [UxTimezoneService]
})
export class PreferencesComponent implements OnInit, OnDestroy {
  userState: any;
  appInfos: string;
  form: FormGroup;
  timezones: any[];
  preferences: Preferences = new Preferences();
  notificationOptions: any[] = [
    { id: '5', value: 'Every 5 seconds' },
    { id: '10', value: 'Every 10 seconds' },
    { id: '30', value: 'Every 30 seconds' },
    { id: '60', value: 'Every 60 seconds' },
  ];

  @Output() updatePreferences: EventEmitter<any> = new EventEmitter<any>();
  @Output() modalClosed: EventEmitter<any> = new EventEmitter<any>();

  private subFormChange: any;

  constructor(
    public translate: TranslateService,
    private uxAppShellService: UxAppShellService,
    private store: Store<any>,
    private fb: FormBuilder,
    public tzService: UxTimezoneService,
    public coreService: CoreService,
  ) {
    this.timezones = tzService.getTimezones();
  }

  ngOnInit() {
    this.userState = this.store.select(getUserState);

    this.store.select(getUserPreferences)
      .pipe(
        take(1)
      )
      .subscribe((prefs: any) => {
        if (prefs.tz) {
          this.preferences = Object.assign({
            tz: { ...this.preferences.tz, ...prefs.tz },
            notifications: { ...this.preferences.notifications, ...prefs.notifications },
          });
        }

        this.form = this.fb.group({
          primary: [this.preferences.tz.primary, Validators.required],
          secondary: [this.preferences.tz.secondary, Validators.required],
          notificationsPullFrequency: [
            this.preferences.notifications.pullingFrequency,
            !this.preferences.notifications.isActive ? [Validators.required] : null,
          ],
          notificationsState: [this.preferences.notifications.isActive],
        });

        this.subFormChange = this.form.valueChanges.subscribe((values) => {
          this.preferences.tz.primary = values.primary;
          this.preferences.tz.secondary = values.secondary;
          this.preferences.notifications.pullingFrequency = values.notificationsState ?
            null : parseInt(values.notificationsPullFrequency, 10);
          this.preferences.notifications.isActive = values.notificationsState;
        });
      });
  }

  ngOnDestroy() {
    this.subFormChange.unsubscribe();
  }

  trackByFn(index, item) {
    return item.name;
  }

  onSave(event: any) {

    markFormGroupTouched(this.form.controls);

    if (this.form.valid) {
      this.store.select(getUserPreferences)
        .pipe(
          take(1)
        )
        .subscribe(prefs => {
          this.store.dispatch(new UpdateUserPreferencesAction({
            ...prefs,
            ...this.preferences,
            tz: { ...this.preferences.tz },
          }));
          this.uxAppShellService.growl({
            severity: 'success',
            summary: 'Success!',
            detail: 'Your preferences has been successfully saved.',
          });

          this.onClose(null);

          this.updatePreferences.emit(this.preferences);
        });
    }
  }

  onClose(event: any) {
    this.coreService.isUserPreferencesOpen = false;
  }

  onTimePrimaryFromHQClick(event: any) {
    this.form.controls.primary.setValue(this.preferences.tz.HQ);
  }

  onTimePrimaryFromBrowserClick(event: any) {
    const m = moment as any;
    const localTz = m.tz.guess();
    this.form.controls.primary.setValue(localTz);
  }

  onTimeSecondaryFromHQClick(event: any) {
    this.form.controls.secondary.setValue(this.preferences.tz.HQ);
  }

  onTimeSecondaryFromBrowserClick(event: any) {
    const m = moment as any;
    const localTz = m.tz.guess();
    this.form.controls.secondary.setValue(localTz);
  }

  onNotificationsStateToggle(event: boolean) {
    const validator = !this.preferences.notifications.isActive ? [Validators.required] : [];
    this.form.controls['notificationsPullFrequency'].setValidators(validator);
    this.form.controls['notificationsPullFrequency'].updateValueAndValidity();
  }
}
