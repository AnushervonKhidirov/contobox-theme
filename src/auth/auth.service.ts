import type { AuthOptions } from './auth.type';

import { Message } from '../message/message';

export class AuthService {
  private readonly username: string;
  private readonly password: string;
  private readonly loginEndpoint: string;
  private SID: string | null;

  constructor({ username, password, endpoint }: AuthOptions) {
    this.username = username;
    this.password = password;
    this.loginEndpoint = endpoint.login;
    this.SID = null;
  }

  getSID() {
    return this.SID;
  }

  async logIn() {
    try {
      Message.log('Logging in ...');

      const pageResponse = await fetch(this.loginEndpoint);
      const cookieString = pageResponse.headers.getSetCookie()[0];
      if (!cookieString) throw "Can't get cookie!";

      this.SID = Bun.Cookie.parse(cookieString).value;

      await fetch(this.loginEndpoint, {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          cookie: `SID=${this.SID}`,
        },
        body: `username=${this.username}&password=${this.password}`,
        method: 'POST',
      });

      Message.log('Logged in successfully!\n\n\n');
    } catch {}
  }
}
