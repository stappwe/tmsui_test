export class Address {
  addressID: number;
  street1: string;
  street2: string;
  postalCode: string;
  city: string;
  countryId: number;
  countryName: string;

  constructor (addressID?: number, street1?: string, street2?: string,
               postalCode?: string, city?: string, countryId?: number, countryName?: string) {
    this.addressID = addressID || -1;
    this.street1 = street1 || '';
    this.street2 = street2 || '';
    this.postalCode = postalCode || '';
    this.city = city || '';
    this.countryId = countryId || -1;
    this.countryName = countryName || '';
  }

  get street(): string {
    return (this.street2 === '') ? this.street1 : this.street1 + ' ' + this.street2;
  }

  public isEmpty(): boolean {
    return this.addressID === -1 && this.street1 === '' && this.street2 === '' && this.postalCode === '' &&
      this.city === '' && this.countryId === -1 && this.countryName === '';
  }
}
