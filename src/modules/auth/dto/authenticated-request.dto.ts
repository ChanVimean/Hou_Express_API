export interface AuthenticatedRequestDto extends Request {
  user: {
    userId: string;
    email: string;
  };
}
