type UserAuthType = {
  userID: number;
  name: string;
  email: string;
  phone: string;
  jwt: string;
};

type DeviceSliceType = {
  isMobile: boolean;
  isLoggedIn: boolean;
};

export type { UserAuthType, DeviceSliceType };
