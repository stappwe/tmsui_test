import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';

import { UxAppShellService } from '@eui/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HelpComponent } from './features/help/help.component';
import { LoadingService, CanDeactivateGuard, ErrorLogService, RequestErrorInterceptor } from 'tms-library';
import { environment } from '../environments/environment';
import { TMSErrorHandler } from './services/tms-error-handler.service';

@NgModule({
  declarations: [
    AppComponent, HelpComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    Title,
    CanDeactivateGuard,
    LoadingService,
    UxAppShellService,
    ErrorLogService,
    { provide: ErrorHandler, useClass: TMSErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: RequestErrorInterceptor, multi: true }
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {
  // private keepAliveRepeatTime: number = 15 * 60 * 1000;  // 15 minutes
  // private keepAliveUrl: string = this.apiBaseUrl + environment.refreshAPI;  // refreshAPI

  constructor() {
    console.log('App started, sw enabled: ' + environment.production);

    /*setInterval(() => {
      if (document.hasFocus()) {
        this.http.get(this.keepAliveUrl).pipe(
          map((data: any) => {
            return true;
          }),
          catchError((error: any) => this.uxService.handleError(error))
        ).subscribe((response: any) => {
          if (environment.production === false ) {
            // console.log("Succeeded? ", response.statusText);
          }
        });
      }
    }, this.keepAliveRepeatTime);*/
  }
}
