export interface BasicInfoCustomerCity {
  name: string;
  code?: any;
}

export interface BasicInfoCustomerAddress {
  city: BasicInfoCustomerCity;
  country: string;
  postalCode: string;
  number: string;
  street: string;
  streetSuffix?: any;
  district: string;
  state: string;
}

export interface BasicInfoCustomerPhone {
  source: string;
  number: string;
  ddd: string;
}

export interface BasicInfoCustomerEconomicActivity {
  code: number;
  type: string;
  description: string;
}

export interface BasicInfoCustomerLegalNature {
  description: string;
  code: string;
}

export interface BasicInfoCustomerQualification {
  description: string;
  code: string;
}

export interface Partner {
  qualification: BasicInfoCustomerQualification;
  name: string;
}

export interface BasicInfoCustomer {
  shareCapital: number;
  federalTaxNumber: number;
  address: BasicInfoCustomerAddress;
  phones: BasicInfoCustomerPhone[];
  economicActivities: BasicInfoCustomerEconomicActivity[];
  legalNature: BasicInfoCustomerLegalNature;
  partners: Partner[];
  size: string;
  status: string;
  unit: string;
  issuedOn: string;
  statusOn: string;
  openedOn: string;
  email?: any;
  name: string;
  tradeName: string;
  district: string;
}
