import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';

export interface ICanDeactivateGuard {
  canDeactivate: () => Observable<boolean>;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ICanDeactivateGuard> {
  canDeactivate(component: ICanDeactivateGuard): Observable<boolean> {
    // if there are no pending changes, just allow deactivation; else confirm first
    return component.canDeactivate(); // ? component.canDeactivate() : of(true);
  }
}
