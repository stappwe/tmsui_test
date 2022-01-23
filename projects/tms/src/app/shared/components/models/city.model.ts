export class City {
  cityID: number;
  name: string;
  lat: number;
  lng: number;
  visible: boolean;
  countryId: number;

  constructor (cityid?: number, name?: string, lat?: number, lng?: number, visible?: boolean, countryId?: number) {
    this.cityID = cityid || -1;
    this.name = name || '';
    this.lat = lat || undefined;
    this.lng = lng || undefined;
    this.visible = (visible) ? visible : false;
    this.countryId = countryId || -1;
  }

  get isVisible(): string {
    return (this.visible === true) ? 'Yes' : 'No';
  }
}
