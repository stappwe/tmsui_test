import { NgModule } from '@angular/core';

import { AdministratorRouting } from './administrator.routing';
import { SharedModule } from '../../../../shared/shared.module';
import { ProjectListComponent } from './projectlist/projectlist.component';
import { ProjectComponent } from './project/project.component';
import { EventTypeListComponent } from './eventtypelist/eventtypelist.component';
import { EventTypeComponent } from './eventtype/eventtype.component';

@NgModule({
  imports: [SharedModule, AdministratorRouting],
  declarations: [EventTypeListComponent, EventTypeComponent, ProjectListComponent, ProjectComponent],
  providers: []
})
export class AdministratorModule {
  constructor() {
    console.log('AdministratorModule started');
  }
}
