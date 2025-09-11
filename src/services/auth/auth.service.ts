import { Cookie } from 'bun';

import timers from 'timers/promises';

import { FileService } from '../files/files.service';
import { Logger } from '../../logger/logger';

import { USERNAME, PASSWORD, LOGIN_ENDPOINT, SID_DIR } from '../../constant';

export class AuthService {
  async logIn(disableClearConsole: boolean = false) {
    try {
      Logger.log('Logging in ...');

      let SID = FileService.readFile(SID_DIR);

      if (!SID) {
        const pageResponse = await fetch(LOGIN_ENDPOINT);
        const cookieString = pageResponse.headers.getSetCookie()[0];
        if (!cookieString) throw new Error('Cookie not found from response');

        let SID = Cookie.parse(cookieString).value;
        FileService.writeFile(SID_DIR, SID);
      }

      const response = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        body: new URLSearchParams({ username: USERNAME, password: PASSWORD }).toString(),
        headers: {
          cookie: new Cookie('SID', SID).serialize(),
          'content-type': 'application/x-www-form-urlencoded',
        },
      });

      const isError = !response.redirected;

      if (isError) {
        Logger.error('Error', 'Wrong username or password');
        process.exit();
      } else {
        if (!disableClearConsole) Logger.clear();
        Logger.success('Success', 'Logged in successfully!', true);

        if (!disableClearConsole) {
          await timers.setTimeout(1000);
          Logger.clear();
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}
