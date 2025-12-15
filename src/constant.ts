import { resolve } from 'node:path';

export const RELOGIN_TIMEOUT = Number.parseInt(Bun.env.RELOGIN_TIMEOUT!);

export const USERNAME = Bun.env.USER_NAME!;
export const PASSWORD = Bun.env.PASSWORD!;

export const LOGIN_ENDPOINT = Bun.env.LOGIN_ENDPOINT!;
export const PULL_THEME_ENDPOINT = Bun.env.PULL_THEME_ENDPOINT!;
export const PUSH_THEME_ENDPOINT = Bun.env.PUSH_THEME_ENDPOINT!;

export const WORKING_DIR = Bun.env.WORKING_DIR!;
export const ASSETS_DIR = resolve(process.cwd(), 'src', 'assets');
export const TEMPLATE_DIR = resolve(ASSETS_DIR, 'templates');

export const SID_DIR = resolve(process.cwd(), '.sid');
