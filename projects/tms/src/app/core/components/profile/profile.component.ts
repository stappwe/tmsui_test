import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { CoreService } from '../../services/core.service';
import { UserProfile } from '../../../shared/components/models/userProfile.model';
import { UxAppShellService } from '@eui/core';

@Component({
  selector: 'app-core-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent {
  @Input() isOnline: boolean;
  @Input() isConnected: boolean;
  @Input() user: UserProfile;

  constructor(
        public translate: TranslateService,
        private uxAppShellService: UxAppShellService,
        private coreService: CoreService
    ) {
  }

  onClose(event: any) {
    this.coreService.isUserProfileOpen = false;
  }
}
