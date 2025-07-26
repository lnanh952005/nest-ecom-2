export type AccessTokenPayload = {
  userId: number;
  email: string;
  name: string;
  phoneNumber: string;
};

export type RefreshtokenPayload = Omit<
  AccessTokenPayload,
  'name' | 'phoneNumber'
>;
