type UserAuthType = {
  userID: number;
  name: string;
  email: string;
  phone: string;
  jwt: string;
};

type DeviceSliceType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  wishList: number[];
};

export type { UserAuthType, DeviceSliceType };
