import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AdministrationComponent } from './administration/administration.component';
import { CanActivateGuard } from '../../../core/services/auth-guard.service';

const helpRedirectURL = '/help';

const AdministrationRoutes: Routes = [
  {
    path: '',
    component: AdministrationComponent,
    children: [
      { path: 'administrator',
        loadChildren: () => import('./+administrator/administrator.module').then(m => m.AdministratorModule),
        canLoad: [CanActivateGuard],
        data: {
          requiredAction: ['lnk_administration_roles', 'lnk_administration_actions', 'lnk_administration_actionroles',
            'lnk_administration_appsettings', 'lnk_administration_project', 'lnk_administration_mailingrecipients',
            'lnk_administration_eventtype'],
          actionMessage: 'Access to the TMS Administrator module is missing. Please consult your helpdesk.',
          redirectURL: helpRedirectURL }
      }
    ]
  }
];

export const AdministrationRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(AdministrationRoutes);
