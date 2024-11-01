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
};

export type { UserAuthType, DeviceSliceType };
