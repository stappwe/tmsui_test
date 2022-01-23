import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'loading-spinner',
  templateUrl : './loading.component.html',
  styleUrls : ['./loading.component.scss']
})
export class LoadingComponent implements OnDestroy {
  private loadingSubscription: Subscription;
  public active: boolean;

  constructor(loading: LoadingService) {
    this.loadingSubscription = loading.status.subscribe((status: boolean) => {
      this.active = status;
    });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
