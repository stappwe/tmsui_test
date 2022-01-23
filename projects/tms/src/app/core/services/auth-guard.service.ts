import { forwardRef, Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Router, RouterStateSnapshot, UrlSegment, Route } from '@angular/router';

import { Observable } from 'rxjs';

import { AppService } from '../../services/app.service';
import { TMSUserService } from '../../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class CanActivateGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(@Inject(forwardRef(() => AppService)) private appService: AppService, private router: Router,
              private userService: TMSUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (this.appService.application.user.isLoaded) {
      // return of(this.checkRouting(state.url));
      return this.checkAccess(route.data);
    } else {
      this.appService.application.setAppType(state.url);
      this.appService.application.logIn().subscribe((result) => {
        this.router.navigateByUrl(state.url);
        // return of(this.checkRouting(state.url));
      });
    }
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this.appService.application.user.isLoaded) {
      return this.checkAccess(route.data);
    } else {
      this.appService.application.setAppType(this.appService.nextRouteUrl);
      this.appService.application.logIn().subscribe((result) => {
        if (this.appService.nextRouteUrl === '/') {
          this.appService.application.setAppType('/tms/events/list');
          this.router.navigate(['/tms/events/list']);
        } else {
          this.router.navigateByUrl(this.appService.nextRouteUrl);
        }
      });
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // If You are handling child routes different way, You can customise here.
    return this.canActivate(route, state);
  }

  private checkAccess(routeData: any): boolean {
    if (routeData.applicationAccess === undefined || this.appService.application.user.hasApplication(routeData.applicationAccess)) {
      if (this.appService.application.user.validAccount === true) {
        if (Array.isArray(routeData.requiredAction) && !this.appService.hasAnyAction(routeData.requiredAction)) {
          this.appService.application.routerData = { message : routeData.actionMessage };
          this.router.navigate([routeData.redirectURL]);
        } else {
          return true;
        }
      } else {
        this.appService.application.routerData = { message : 'Your account is not active, please contact near-taiex@ec.europa.eu for further questions.' };
        this.router.navigate([routeData.redirectURL]);
      }
    } else {
      this.appService.application.routerData = { message : routeData.applicationMessage, applicationAccess: false };
      this.router.navigate([routeData.redirectURL]);
      return false;
    }
  }
}
