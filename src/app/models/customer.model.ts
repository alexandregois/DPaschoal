export interface CustomerAddress {
  id?: number;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  zipcode?: string;
  uf?: string;
  city?: string;
  codeCity?: number;
  idUf?: number;
  idCity?: number;
}

export interface CustomerEconomicActivity {
  id?: number;
  typeEconomicActivity?: string;
  idEconomicActivity?: number;
}

export interface CustomerPortal {
  id?: number;
  idPortal?: number;
}

export interface CustomerSegment {
  id?: number;
  idSegment?: number;
}

export interface CustomerUser {
  id?: number;
  idCustomer?: number;
  idUser?: number;
}

export interface EconomicActivity {
  id?: number;
  code?: number;
  type?: string;
  description?: string;
  priority?: boolean;
}

export interface Customer {
  allowShareData?: boolean;
  approvedCredit?: boolean;
  cellPhone?: string;
  cnpj?: string;
  corporateEmail?: string;
  corporateName?: string;
  customerAddresses?: CustomerAddress[];
  customerEconomicActivities?: CustomerEconomicActivity[];
  customerPortals?: CustomerPortal[];
  customerSegments?: CustomerSegment[];
  customerUsers?: CustomerUser[];
  dateFoundation?: string;
  economicActivities?: EconomicActivity[];
  email?: string;
  fantasyName?: string;
  id?: number;
  ie?: string;
  integrateOnpremise?: boolean;
  landlinePhone?: string;
  owner?: string;
}
