export class Preferences {
  lang: string;
  tz: {
    primary: string,
    secondary: string,
    HQ: string,
  };
  notifications: {
    isActive: boolean,
    pullingFrequency: number,
    lastClickOnBell: number,
  };

  constructor() {
    this.lang = 'en';
    this.tz = { primary: 'Europe/Brussels', secondary: 'Europe/Brussels', HQ: 'Europe/Brussels' };
    this.notifications = { isActive: true, pullingFrequency: null, lastClickOnBell: null };
  }
}
