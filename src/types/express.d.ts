import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    cookies: {
      access_token?: string;
      refresh_token?: string;
    };
  }
}
