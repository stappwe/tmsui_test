import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { CanActivateGuard } from '../../../../core/services/auth-guard.service';
import { ProjectListComponent } from './projectlist/projectlist.component';
import { ProjectComponent } from './project/project.component';
import { CanDeactivateGuard } from 'tms-library';

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
  }
];

export const AdministratorRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(AdministratorRoutes);
