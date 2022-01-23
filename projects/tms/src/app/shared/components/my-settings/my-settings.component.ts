import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { UxAppShellService } from '@eui/core';

import { BackupUser, User, UserRole } from '../models/userProfile.model';
import { AppService } from '../../../services/app.service';
import { IMultiSelectOption, BaseMessageComponent, enAlert } from 'tms-library';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'my-settings',
  templateUrl: './my-settings.component.html',
  styleUrls: ['./my-settings.component.scss']
})
export class MySettingsComponent extends BaseMessageComponent implements OnInit {
  // list of users
  public forUserList: Array<BackupUser> = [];
  public backupUserList: Array<BackupUser> = [];
  // list of teams
  public teamList: Array<IMultiSelectOption> = [];
  public activeUserRole: FormControl = new FormControl();
  public selectedTeamId: FormControl = new FormControl();
  public xsDevice: boolean = false;
  // selected user
  private _selectedForUser: BackupUser;
  private _userRoleSubscription: Subscription;
  private _selectedTeamSubscription: Subscription;
  get selectedForUser(): BackupUser {
    return this._selectedForUser;
  }

  set selectedForUser(value: BackupUser) {
    this._selectedForUser = value;
    // update list of backup users
    this._selectedBackupUser = undefined;
    if (this._selectedForUser) {
      this.appService.getBackupUser(this._selectedForUser.userId)
        .subscribe(
          (data: Array<BackupUser>) => {
            if (data.length > 0) {
              data.unshift(new BackupUser());
            }
            this.backupUserList = data;
            this._selectedBackupUser = _.find(this.backupUserList, ['userId', this._selectedForUser.backupUserId]) as BackupUser;
          },
          errMsg => {
            this.showAlert('Loading of the list of possible backup users failed: ' + errMsg, enAlert.danger);
          }
        );
    }
  }

  private _selectedBackupUser: BackupUser;

  get selectedBackupUser(): BackupUser {
    return this._selectedBackupUser;
  }

  set selectedBackupUser(value: BackupUser) {
    // set the backup user
    if (value) {
      this.appService.setBackupUser(this._selectedForUser.userId, value.userId, this.appService.hasAction('lnk_my_settings_all_access'))
        .subscribe(
          (data: any) => {
            // update UI if succeeded
            if (data.result === true) {
              this._selectedBackupUser = value;
              this._selectedForUser.backupUserId = this._selectedBackupUser.userId;
              if (this.appService.application.user.userId === this._selectedForUser.userId) {
                this.appService.application.user.backupUser = new BackupUser(this._selectedBackupUser.userId, this._selectedBackupUser.firstName,
                  this._selectedBackupUser.familyName);
              }
            } else {
              // Compose message
              let message = 'Saving failed';
              message = (data.message !== '') ? message + ': ' + data.message : message;
              this.showAlert(message, enAlert.danger);
            }
          },
          errMsg => {
            this.showAlert('Updating of the backup user failed - ' + errMsg, enAlert.danger);
          }
        );
    }
  }

  constructor(@Inject(forwardRef(() => AppService)) public appService: AppService, dialog: MatDialog,
              uxAppShellService: UxAppShellService, public media: MediaObserver) {
    super(dialog, uxAppShellService);
    this.activeUserRole.setValue(this.appService.application.user.activeUserRole);
    this.activeUserRole.updateValueAndValidity();
    this._userRoleSubscription = this.appService.application.user.activeUserRoleEmitter.subscribe((role: UserRole) => {
      if (this.activeUserRole.value !== role) {
        // Check if possible to modify user role
        this.activeUserRole.setValue(this.appService.application.user.activeUserRole);
        this.activeUserRole.updateValueAndValidity();
      }
    });
    this.selectedTeamId.setValue(this.appService.application.user.activeTeamId);
    this.selectedTeamId.updateValueAndValidity();
    this._selectedTeamSubscription = this.appService.application.user.activeTeamIdEmitter.subscribe((teamId: number) => {
      if (this.selectedTeamId.value !== teamId) {
        // Check if possible to modify team
        this.selectedTeamId.setValue(teamId);
        this.selectedTeamId.updateValueAndValidity();
        this.appService.setTeam(this._selectedForUser.userId, teamId).subscribe();
      }
    });
    this.xsDevice = this.media.isActive('xs');
  }

  ngOnInit() {
    if (this.appService.hasAction('lnk_my_settings_all_access')) {
      this.appService.getAllUsers()
        .subscribe(
          (data: Array<BackupUser>) => {
            this.forUserList = data;
            // set active user
            this.selectedForUser = _.find(this.forUserList, ['userId', this.appService.application.user.userId]) as BackupUser;
          },
          errMsg => {
            this.showAlert('Loading of the list of users failed - ' + errMsg, enAlert.danger);
          }
        );
    } else {
      this.forUserList = [new BackupUser(this.appService.application.user.userId, this.appService.application.user.firstName,
        this.appService.application.user.familyName, this.appService.application.user.backupUser.userId)];
      this.selectedForUser = this.forUserList[0];
    }
    if (this.appService.hasAction('lnk_my_settings_team_access')) {
      this.appService.getTeamList()
        .subscribe(
          (data: Array<any>) => {
            data.unshift({});
            this.teamList = data;
          },
          errMsg => {
            this.showAlert('Loading of the list of users failed - ' + errMsg, enAlert.danger);
          }
        );
    }

    this.activeUserRole.valueChanges
      .subscribe((value: UserRole) => {
        // only check if the role is different
        if (this.appService.application.user.activeUserRole !== value) {
          this.appService.application.user.activeUserRole = value;
        }
      });

    this.selectedTeamId.valueChanges
      .subscribe((value: number) => {
        // only check if the role is different
        if (this.appService.application.user.activeTeamId !== value) {
          this.appService.application.user.activeTeamId = value;
          this.appService.setTeam(this._selectedForUser.userId, value).subscribe();
        }
      });
  }

  public hasAction(actionName: string): boolean {
    return this.appService.hasAction(actionName);
  }

  public isIBURole(): boolean {
    return this.appService.application.user.isIBURole();
  }
}
