import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { HomeComponent } from './home/home.component';
import { CanActivateGuard } from '../../core/services/auth-guard.service';

const helpRedirectURL = '/help';

const TMSRoutes: Routes = [
  { path: '',
    children: [
      { path: 'home', component: HomeComponent, data: { title: 'Home' } },
      { path: 'other',
        children: [
          {
            path: 'administration',
            loadChildren: () => import('./+administration/administration.module').then(m => m.AdministrationModule),
            canLoad: [CanActivateGuard],
            data: {
              title: 'Administration',
              requiredAction: ['lnk_amadeus', 'btn_web_folder', 'lnk_ibuadministration_city', 'lnk_ibuadministration_general',
                'lnk_ibuadministration_dsa', 'lnk_consult_dsa', 'lnk_administration_users', 'lnk_administration_actions', 'lnk_administration_roles',
                'lnk_administration_actionroles', 'lnk_administration_appsettings', 'lnk_administration_project', 'lnk_administration_mailingrecipients',
                'lnk_administration_eventtype', 'lnk_administration_paymenttransferrate', 'lnk_application_form_online'],
              actionMessage: 'Access to the TMS Administration module is missing. Please consult your helpdesk.',
              redirectURL: helpRedirectURL
            }
          }
        ]
      },
      { path: '', redirectTo: '/tms/home' },
      { path: '**', redirectTo: '/tms/home' }
    ]
  }
];

// - Updated Export
export const TMSRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(TMSRoutes);
