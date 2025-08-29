import {
  existsSync,
  mkdirSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  watch,
} from 'fs';
import { resolve } from 'path';

import { Message } from '../message/message';

export class FileService {
  static createFolder(path: string) {
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
  }

  static createFile(path: string, data: string) {
    if (existsSync(path)) throw `file already exists: ${path}`;
  }

  static readFile(path: string) {
    if (!existsSync(path)) throw `Path not found: ${path}`;

    return readFileSync(path, { encoding: 'utf-8' });
  }

  static writeFile(path: string, data: string) {
    if (!existsSync(path)) throw `Path not found: ${path}`;

    writeFileSync(path, data, { encoding: 'utf-8' });
  }

  static readDir(path: string) {
    if (!existsSync(path)) throw `Path not found: ${path}`;

    return readdirSync(path, { encoding: 'utf-8' });
  }

  static copy(pathFrom: string, pathTo: string) {
    if (!existsSync(pathFrom)) throw `Path not found: ${pathFrom}`;
    if (!existsSync(pathTo)) this.createFolder(pathTo.replace(/[\w-]+\.[A-Za-z0-9]{2,5}/g, ''));

    console.log('pathFrom', pathFrom);
    console.log('pathTo', pathTo);

    copyFileSync(pathFrom, pathTo);
  }

  static watchFile() {}
}
