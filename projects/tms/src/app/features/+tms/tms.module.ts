import { NgModule } from '@angular/core';

import { TMSRouting } from './tms.routing';
import { TMSCanActivateGuard } from './tmscanactivate.guard';
import { TMSService } from '../../services/tms.service';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [SharedModule, TMSRouting],
  declarations: [HomeComponent],
  providers: [TMSCanActivateGuard, TMSService]
})
export class TMSModule {
  constructor() {
    console.log('TMSModule started');
  }
}
