import { NgModule } from '@angular/core';

import { AdministratorRouting } from './administrator.routing';
import { SharedModule } from '../../../../shared/shared.module';
import { ProjectListComponent } from './projectlist/projectlist.component';
import { ProjectComponent } from './project/project.component';

@NgModule({
  imports: [SharedModule, AdministratorRouting],
  declarations: [ProjectListComponent, ProjectComponent],
  providers: []
})
export class AdministratorModule {
  constructor() {
    console.log('AdministratorModule started');
  }
}
