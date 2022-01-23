import { Component, ViewEncapsulation } from '@angular/core';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-core-user-settings',
  templateUrl: './user-settings.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class UserSettingsComponent {
  constructor(private coreService: CoreService) {
    // do nothing
  }

  onClose(event: any) {
    this.coreService.isUserSettingsOpen = false;
  }
}
