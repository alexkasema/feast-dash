export interface SingleUserType {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface UserDataType {
  user: {
    _id?: string;
    name?: string;
    email?: string;
    isAdmin?: boolean;
    phone?: string;
    streetAddress?: string;
    postalCode?: string;
    city?: string;
  };
}

export interface TUserData {
  _id?: string;
  name?: string;
  email?: string;
  isAdmin?: boolean;
  phone?: string;
  streetAddress?: string;
  postalCode?: string;
  city?: string;
}

export interface TCategory {
  _id: string;
  name: string;
}
