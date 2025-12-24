export type GetProfileResponse = {
  success: boolean;
  message: string;
  data: User;
};
export type User = {
  id: number;
  name: string;
  photo: string | null;
  login: string;
};
