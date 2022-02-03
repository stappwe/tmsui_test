import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { CanActivateGuard } from '../../../../core/services/auth-guard.service';
import { ProjectListComponent } from './projectlist/projectlist.component';
import { ProjectComponent } from './project/project.component';
import { CanDeactivateGuard } from 'tms-library';
import { EventTypeListComponent } from './eventtypelist/eventtypelist.component';
import { EventTypeComponent } from './eventtype/eventtype.component';

const helpRedirectURL = '/help';

const AdministratorRoutes: Routes = [
  { path: 'project', canActivate: [CanActivateGuard],
    data: {
      title: 'Projects',
      requiredAction: ['lnk_administration_project'],
      actionMessage: 'Access to project menu item is missing. Please consult your helpdesk.',
      redirectURL: helpRedirectURL },
    children: [
      { path: 'list', component: ProjectListComponent },
      { path: ':projectId', component: ProjectComponent, canDeactivate: [CanDeactivateGuard] }
    ]
  },
  { path: 'eventtype', canActivate: [CanActivateGuard],
    data: {
      title: 'Event types',
      requiredAction: ['lnk_administration_eventtype'],
      actionMessage: 'Access to event type menu item is missing. Please consult your helpdesk.',
      redirectURL: helpRedirectURL },
    children: [
      { path: 'list', component: EventTypeListComponent },
      { path: ':eventTypeId', component: EventTypeComponent, canDeactivate: [CanDeactivateGuard] }
    ]
  }
];

export const AdministratorRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(AdministratorRoutes);
