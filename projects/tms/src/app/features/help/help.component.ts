import { Component, OnInit, forwardRef, Inject, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

import { AppService } from '../../services/app.service';

@Component({
  selector: 'help-form',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit, DoCheck {
  public message: string;
  public applicationAccess: boolean;

  constructor(@Inject(forwardRef(() => AppService)) private appService: AppService, private router: Router) {
    this.message = '';
    this.applicationAccess = true;
  }

  ngOnInit() {
    // do nothing
  }

  ngDoCheck() {
    // load message from routerData
    this.message = (this.appService && this.appService.application.routerData && this.appService.application.routerData.message)
      ? this.appService.application.routerData.message : '';
    this.applicationAccess = (this.appService && this.appService.application.routerData
      && this.appService.application.routerData.applicationAccess !== undefined)
      ? this.appService.application.routerData.applicationAccess : true;
  }

  public btnRequestAccess(): void {
    this.router.navigate(['/requestAccess']);
  }
}
