export class ContactInfo {
  contactInfoID: number;
  email: string;
  telephone: string;
  mobilephone: string;
  fax: string;
  website: string;
  usageType: number;
  emailVerified: boolean;
  useInCommunication: boolean;

  constructor(contactInfoID?: number, email?: string, telephone?: string,
              mobilephone?: string, fax?: string, website?: string,
              usageType?: number, emailVerified?: boolean, useincommunication?: boolean) {
    this.contactInfoID = contactInfoID || -1;
    this.email = email || '';
    this.telephone = telephone || '';
    this.mobilephone = mobilephone || '';
    this.fax = fax || '';
    this.website = website || '';
    this.usageType = usageType || -1;
    this.emailVerified = emailVerified || false;
    this.useInCommunication = useincommunication || false;
  }
}
