import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable, Inject, forwardRef } from '@angular/core';

import { Observable } from 'rxjs';

import { AppService } from '../../services/app.service';
import { environment } from '../../../environments/environment';
import { GeneralRoutines } from 'tms-library';
import { TMSService } from '../../services/tms.service';

@Injectable()
export class TMSCanActivateGuard implements CanActivate {
  // Forward needed since it could be possible that the service is not already created
  constructor(@Inject(forwardRef(() => AppService)) private appService: AppService, private tmsService: TMSService,
              private router: Router) {
    // do nothing
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // Check if user has access to TMS
    if (this.appService.application.user.isLoaded) {
      return this.checkRouting(state.url, route);
    } else { return false; }
  }

  public openPopUp(url: string, target: string, width, height, scroll) {
    const top = (screen.height - height) / 2;
    const left = (screen.width - width) / 2;

    window.open(GeneralRoutines.getAbsolutePath(environment.oldTMSUrl) + url, target,
      'menubar=no, toolbar=no, location=no, resizable=no, width=' + width + ', height=' + height +
      ', left=' + left + ', top=' + top + ', scrollbars=' + scroll + ', status=0');
  }

  public openWindowForRealStatisticData(templateId: number) {
    if (templateId > 9) {
      window.open(this.tmsService.downloadStatisticsReport(templateId));
    } else {
      this.tmsService.checkStatisticsReport(templateId).subscribe((result) => {
        if (result === true) {
          window.open(this.tmsService.downloadStatisticsReport(templateId));
        } else {
          this.appService.application.routerData = {
            message:
              'There is a technical problem. Please contact near-taskcard@ec.europa.eu.'
          };
          this.router.navigate(['/help']);
        }
      });
    }
  }

  private checkRouting(url: string, route: ActivatedRouteSnapshot): boolean {
    if (url.contains('/tms/statistics/general')) {
      if (!Array.isArray(route.data.requiredAction) || this.appService.hasAnyAction(route.data.requiredAction)) {
        // temp solution until migrated
        const urlTree = url.split('/');
        const templateId = Number(urlTree[urlTree.length - 1]);
        switch (templateId) {
        case 12 :
          this.openPopUp('statisticEventStatus.do?dispatch=Init', 'statisticEventStatus', 460, 380, 1);
          break;
        default :
          this.openWindowForRealStatisticData(templateId);
          break;
        }
        return false;
      } else {
        this.appService.application.routerData = { message :
            'Access to the TMS Statistics - General menu is missing. Please consult your helpdesk.' };
        this.router.navigate(['/help']);
      }
    } else if (url.contains('/tms/statistics/reports')) {
      if (!Array.isArray(route.data.requiredAction) || this.appService.hasAnyAction(route.data.requiredAction)) {
        // temp solution until migrated
        const urlTree = url.split('/');
        const templateId = Number(urlTree[urlTree.length - 1]);
        switch (templateId) {
        case 21 :
          this.openPopUp('reports/events_by_subject.jsp', 'events_by_subject', 800, 550, 0);
          break;
        case 22 :
          this.openPopUp('statisticLogisticRatings.do?dispatch=Init', 'statisticLogisticRatings', 400, 320, 1);
          break;
        }
        return false;
      } else {
        this.appService.application.routerData = { message :
            'Access to the TMS Statistics - Reports menu is missing. Please consult your helpdesk.' };
        this.router.navigate(['/help']);
      }
    } else if (url.contains('/tms/statistics/logistics')) {
      if (!Array.isArray(route.data.requiredAction) || this.appService.hasAnyAction(route.data.requiredAction)) {
        const urlTree = url.split('/');
        const templateId = Number(urlTree[urlTree.length - 1]);
        window.open(this.tmsService.downloadStatisticsReport(templateId));
        return false;
      } else {
        this.appService.application.routerData = { message :
            'Access to the TMS Statistics - Logistics menu is missing. Please consult your helpdesk.' };
        this.router.navigate(['/help']);
      }
    } else {
      this.appService.application.routerData = { message : `Navigation problem for - ${url}` };
      this.router.navigate(['/help']);
    }
  }
}
