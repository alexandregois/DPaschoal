export interface City {
  name: string;
  code: string;
}

export interface Address {
  city: City;
  postalCode: string;
  number: string;
  street: string;
  streetSuffix?: any;
  additionalInformation?: any;
  district: string;
}

export interface EconomicActivity {
  code: number;
  type: string;
}

export interface Nfe {
  status: string;
  description: string;
}

export interface Nfse {
  status: string;
  description: string;
}

export interface Cte {
  status: string;
  description: string;
}

export interface Nfce {
  status: string;
  description: string;
}

export interface StateTax {
  address: Address;
  economicActivities: EconomicActivity[];
  status: string;
  code: string;
  nfe: Nfe;
  nfse: Nfse;
  cte: Cte;
  nfce: Nfce;
  openedOn: string;
  statusOn: string;
  taxNumber: string;
}

export interface StateTaxInfoCustomer {
  federalTaxNumber: number;
  stateTaxes: StateTax[];
  taxRegime: string;
  createdOn: string;
  name: string;
}
