type UserAuthType = {
  userID: number;
  name: string;
  email: string;
  phone: string;
  jwt: string;
};

type DeviceSliceType = {
  isMobile: null | boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
};

export type { UserAuthType, DeviceSliceType };
