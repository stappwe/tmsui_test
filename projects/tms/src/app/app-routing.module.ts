import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanActivateGuard } from './core/services/auth-guard.service';
import { HelpComponent } from './features/help/help.component';
import { enApplicationType } from './shared/components/models/userProfile.model';

const helpRedirectURL = '/help';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tms',
    pathMatch: 'full'
  },
  {
    path: 'tms',
    loadChildren: () => import('./features/+tms/tms.module').then(m => m.TMSModule),
    canLoad: [CanActivateGuard],
    data: {
      applicationAccess: enApplicationType.TMS,
      applicationMessage: 'Access to the TMS application is missing. Please consult your helpdesk.',
      redirectURL: helpRedirectURL }
  },
  { path: 'help', component: HelpComponent },
  { path: '**', redirectTo: 'tms' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true }), /* , enableTracing: true */
  ],
})
export class AppRoutingModule { }
