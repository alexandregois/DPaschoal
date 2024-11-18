export interface UserPermission {
  id?: number;
  idUser?: number;
  idPermission?: number;
}

export interface UserPortal {
  id?: number;
  idUser?: number;
  idPortal?: number;
}

export interface Usuario {
  id?: number;
  name?: string;
  phone?: string;
  email?: string;
  idPortal?: number;
  userPermissions?: UserPermission[];
  userPortals?: UserPortal[];
}
