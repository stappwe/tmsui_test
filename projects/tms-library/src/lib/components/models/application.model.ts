import * as moment from 'moment';

export class ApplicationMessage {
  public startDate: moment.Moment;
  public endDate: moment.Moment;
  public enabled: boolean;
  public summary: string;
  public message: string;

  constructor(data: {
    startDate: moment.Moment,
    endDate: moment.Moment,
    enabled: boolean,
    summary: string,
    message: string
  } = { startDate: null, endDate: null, enabled: false, summary: '', message: '' }) {
    if (data != null) {
      Object.assign(this, data);
      // utc timezone
      this.startDate = moment.utc(data.startDate);
      this.endDate = moment.utc(data.endDate);
    }
  }

  public storeLastDisplayed(): boolean {
    const storageName = 'tms_application_message';
    try {
      // Local storage data
      window.localStorage.setItem(storageName, JSON.stringify({
        'lastDisplayed' : moment.utc().format('YYYY-MM-DDTHH:mm:ss-00:00')
      }));
    } catch (e) {
      console.log('store saving lastDisplayed failed - ' + e);
      window.localStorage.removeItem(storageName);
      return false;
    }

    return true;
  }

  public loadLastDisplayed(): moment.Moment {
    const storageName = 'tms_application_message';
    let lastDisplayed: moment.Moment = moment.utc();
    try {
      // load localstorage state settings
      const localStateStr = window.localStorage.getItem(storageName);
      if (localStateStr !== null) {
        const localState = JSON.parse(localStateStr);
        lastDisplayed = moment.utc(localState.lastDisplayed);
      } else {
        lastDisplayed = moment.utc().add(-1, 'day');
      }
    } catch (e) {
      console.log('store loading lastDisplayed failed - ' + e);
      window.localStorage.removeItem(storageName);
    }

    return lastDisplayed;
  }
}
