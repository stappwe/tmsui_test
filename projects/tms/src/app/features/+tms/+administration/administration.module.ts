import { NgModule } from '@angular/core';

import { AdministrationRouting } from './administration.routing';
import { AdministrationComponent } from './administration/administration.component';
import { TMSAdministrationService } from '../../../services/tmsAdministration.service';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [SharedModule, AdministrationRouting],
  declarations: [AdministrationComponent],
  providers: [TMSAdministrationService]
})
export class AdministrationModule {
  constructor() {
    console.log('AdministrationModule started');
  }
}
