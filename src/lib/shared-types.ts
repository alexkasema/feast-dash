interface UserDataType {
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

export interface TCategory {
  _id: string;
  name: string;
}
