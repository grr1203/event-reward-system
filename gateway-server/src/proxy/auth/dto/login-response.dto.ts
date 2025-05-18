export class LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
  };
} 