import { Component, OnDestroy, OnInit, ElementRef, ViewChild, HostListener, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, Observable, forkJoin } from 'rxjs';
import { UxAppShellService } from '@eui/core';

import { TMSAdministrationService } from '../../../../../services/tmsAdministration.service';
import { EventType } from '../shared/administrator.model';
import { MultiSelectOption, ICanDeactivateGuard, BaseDetailComponent, enAlert } from 'tms-library';

@Component({
  selector: 'eventtype-form',
  templateUrl: './eventtype.component.html',
  styleUrls: ['./eventtype.component.scss']
})
export class EventTypeComponent extends BaseDetailComponent implements OnInit, OnDestroy, ICanDeactivateGuard {
  @ViewChild('header', { static: false }) header: ElementRef;

  private idSubscription$: Subscription;
  private userCategoryId: number;

  public eventTypeId: number;
  public budgetTeamList: Array<any> = [];
  public eventCategoryList: Array<MultiSelectOption> = [];
  public teamLeaderList: Array<any> = [];
  public eventType: EventType;
  public detailForm: FormGroup;
  public readOnlyMode: boolean = false;

  constructor(private formBuilder: FormBuilder, ngzone: NgZone, cdr: ChangeDetectorRef, public tmsAdministrationService: TMSAdministrationService,
              private _activatedRoute: ActivatedRoute, private _router: Router, dialog: MatDialog,
              uxAppShellService: UxAppShellService) {
    super(ngzone, dialog, cdr, uxAppShellService);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.idSubscription$.unsubscribe();
  }

  @HostListener('window:beforeunload')
  public canDeactivate(): Observable<boolean> {
    return super.canDeactivate();
  }

  ngOnInit() {
    this.readOnlyMode = false; // optional can still be set

    this.idSubscription$ = this._activatedRoute.params.subscribe(params => {
      this.eventTypeId = Number(params['eventTypeId']);

      let eventTypeData = this.tmsAdministrationService.getEventType(this.eventTypeId);
      let budgetTeamListData = this.tmsAdministrationService.appService.getTeamList();
      let eventCategoryListData = this.tmsAdministrationService.getEventCategoryList();
      let teamLeaderListData = this.tmsAdministrationService.getTeamLeaderList();
      forkJoin(eventTypeData, budgetTeamListData, eventCategoryListData, teamLeaderListData).subscribe(
        (res: Array<any>) => {
          this.eventType = res[0];
          this.budgetTeamList = res[1];
          this.eventCategoryList = res[2];
          this.teamLeaderList = res[3];

          this.buildForm();
        },
        errMsg => { this.showAlert('Loading detail error: ' + errMsg, enAlert.danger); }
      );

      this.pageTitle = 'Update event type';
    });
  }

  public onSubmit() {
    this.updateEventType();
    this.tmsAdministrationService.setEventType(this.eventType).subscribe(
      (eventType: EventType) => {
        this.eventType = eventType;
        this.buildForm();
        this.submitting = false;
        this.showAlert('Data successfully saved ' , enAlert.success, 10);
      },
      errMsg => {
        this.showAlert('Event type detail saving failed - ' + errMsg, enAlert.danger);
        this.submitting = false;
      }
    );
    this.submitting = true;
  }

  public onCancelClick(): void {
    this._router.navigate(['../list'], { relativeTo: this._activatedRoute });
  }

  private buildForm(): void {
    if (this.eventType !== undefined) {
      this.detailForm = this.formBuilder.group({
        eventTypeId: [this.eventType.eventTypeId, Validators.required],
        description: [this.eventType.description, Validators.compose([Validators.required, Validators.maxLength(90)])],
        abbreviation: [this.eventType.abbreviation, Validators.compose([Validators.required, Validators.maxLength(20)])],
        active: [this.eventType.active, Validators.required],
        status: [this.eventType.status, Validators.required],
        taiexPublish: [this.eventType.taiexPublish, Validators.required],
        edbPublish: [this.eventType.edbPublish, Validators.required],
        agendaRequired: [this.eventType.agendaRequired, Validators.required],
        budgetTeamId: [this.eventType.budgetTeamId, Validators.required],
        eventCategoryId: [this.eventType.eventCategoryId, Validators.required],
        userId : [this.eventType.userId, Validators.compose([Validators.required, Validators.maxLength(50)])],
        evaluationRequired: [this.eventType.evaluationRequired, Validators.required],
      });

      // provide the link ID for the selection on the return of the routing
      this.tmsAdministrationService.appService.application.routerData = { ID : this.eventType.eventTypeId };

      if (this.readOnlyMode === false) {
        this.detailForm.enable();
      } else { this.detailForm.disable(); }
      // Address of Institution setting
      this.detailForm.controls.eventTypeId.disable();
      this.fireWindowResize();
    }
  }

  private updateEventType(): void {
    this.eventType.eventTypeId = this.detailForm.getRawValue().eventTypeId;
    this.eventType.description = this.detailForm.getRawValue().description;
    this.eventType.abbreviation = this.detailForm.getRawValue().abbreviation;
    this.eventType.active = this.detailForm.getRawValue().active ;
    this.eventType.status = this.detailForm.getRawValue().status;
    this.eventType.taiexPublish = this.detailForm.getRawValue().taiexPublish;
    this.eventType.edbPublish = this.detailForm.getRawValue().edbPublish;
    this.eventType.agendaRequired = this.detailForm.getRawValue().agendaRequired;
    this.eventType.evaluationRequired = this.detailForm.getRawValue().evaluationRequired;

    this.eventType.budgetTeamId = this.detailForm.getRawValue().budgetTeamId;
    this.eventType.eventCategoryId = this.detailForm.getRawValue().eventCategoryId;
    this.eventType.userId = this.detailForm.getRawValue().userId;
  }
}
