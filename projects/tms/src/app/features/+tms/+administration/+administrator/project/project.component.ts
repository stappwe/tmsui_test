import { Component, OnDestroy, OnInit, ElementRef, ViewChild, HostListener, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription, Observable } from 'rxjs';
import { UxAppShellService } from '@eui/core';

import { GeneralRoutines, ICanDeactivateGuard, BaseDetailComponent, enAlert } from 'tms-library';
import { TMSAdministrationService } from '../../../../../services/tmsAdministration.service';
import { Project } from '../shared/administrator.model';

@Component({
  selector: 'project-form',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent extends BaseDetailComponent implements OnInit, OnDestroy, ICanDeactivateGuard {
  @ViewChild('header', { static: false }) header: ElementRef;

  private idSubscription$: Subscription;
  private projectId: number;

  public project: Project;
  public detailForm: FormGroup;

  constructor(private formBuilder: FormBuilder, ngzone: NgZone, cdr: ChangeDetectorRef, private _activatedRoute: ActivatedRoute,
              public tmsAdministrationService: TMSAdministrationService, private _router: Router, dialog: MatDialog, uxAppShellService: UxAppShellService) {
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
    this.pageTitle = 'Update project';

    this.idSubscription$ = this._activatedRoute.params.subscribe(params => {
      this.projectId = Number(params['projectId']);
      // initial setting in case of problems further in the loading
      this.tmsAdministrationService.appService.application.routerData = { ID : this.projectId };

      this.tmsAdministrationService.getProject(this.projectId).subscribe(
        (data: Project) => {
          this.project = data;

          this.buildForm();
        },
        errMsg => { this.showAlert('Loading detail error: ' + errMsg, enAlert.danger); }
      );
    });
  }

  public onSubmit() {
    this.updateProject();
    this.tmsAdministrationService.setProject(this.project).subscribe(
      (project: Project) => {
        this.project = project;
        this.buildForm();
        this.submitting = false;
        this.showAlert('Data successfully saved ' , enAlert.success, 10);
      },
      errMsg => {
        this.showAlert('Project saving failed - ' + errMsg, enAlert.danger);
        this.submitting = false;
      }
    );
    this.submitting = true;
  }

  public onCancelClick(): void {
    this._router.navigate(['../list'], { relativeTo: this._activatedRoute });
  }

  public setConsultation(value: number): void {
    this.detailForm.controls['consultation'].setValue(value);
    this.detailForm.controls['consultation'].markAsDirty();
  }

  private buildForm(): void {
    if (this.project !== undefined) {
      this.detailForm = this.formBuilder.group({
        projectId : [this.project.projectId],
        description: [this.project.description, Validators.compose([Validators.required, Validators.maxLength(200)])],
        abbreviation: [this.project.abbreviation, Validators.compose([Validators.required, Validators.maxLength(20)])],
        consultation: [this.project.consultation, Validators.required],
        generalEmail: [this.project.generalEmail, Validators.compose([Validators.maxLength(250), GeneralRoutines.emailValidator])],
        signatureEmail: [this.project.signatureEmail, GeneralRoutines.maxByteSizeValidator(1000)],
        signatureEmailOutlook: [this.project.signatureEmailOutlook, GeneralRoutines.maxByteSizeValidator(1000)],
        emailRequestValidator: [this.project.emailRequestValidator, Validators.compose([Validators.maxLength(250), GeneralRoutines.emailValidator])],
        comment: [this.project.comment, GeneralRoutines.maxByteSizeValidator(2000)]
      });

      // provide the link ID for the selection on the return of the routing
      this.tmsAdministrationService.appService.application.routerData = { ID : this.project.projectId };

      if (this.readOnlyMode === false) {
        this.detailForm.enable();
      } else { this.detailForm.disable(); }
      // Disable actionId
      this.detailForm.controls.projectId.disable();
      this.fireWindowResize();
    }
  }

  private updateProject(): void {
    this.project.projectId = this.detailForm.getRawValue().projectId;
    this.project.description = this.detailForm.getRawValue().description;
    this.project.abbreviation = this.detailForm.getRawValue().abbreviation;
    this.project.comment = this.detailForm.getRawValue().comment;
    this.project.emailRequestValidator = this.detailForm.getRawValue().emailRequestValidator;
    this.project.generalEmail = this.detailForm.getRawValue().generalEmail;
    this.project.signatureEmail = this.detailForm.getRawValue().signatureEmail;
    this.project.signatureEmailOutlook = this.detailForm.getRawValue().signatureEmailOutlook;
    this.project.consultation = this.detailForm.getRawValue().consultation;
  }
}
