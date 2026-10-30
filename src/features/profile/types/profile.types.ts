export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface AddressesApiResponse {
  status: string;
  results: number;
  data: Address[];
}

export interface AddAddressBody {
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface UpdateProfileBody {
  name: string;
  email: string;
  phone: string;
}

export interface ChangePasswordBody {
  currentPassword: string;
  password: string;
  rePassword: string;
}
