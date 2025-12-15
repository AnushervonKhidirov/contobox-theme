import {
  existsSync,
  mkdirSync,
  copyFileSync,
  readFileSync,
  writeFileSync,
  readdirSync,
} from 'node:fs';

type CreateFileOptions = {
  showError: boolean;
};

export class FileService {
  static createFolder(path: string) {
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
  }

  static createFile(path: string, data: string = '', options?: CreateFileOptions) {
    const isExist = existsSync(path);

    if (isExist && options?.showError) throw new Error(`file already exists: ${path}`);
    if (!isExist) writeFileSync(path, data, { encoding: 'utf-8' });
  }

  static readFile(path: string) {
    if (!existsSync(path)) throw new Error(`Path not found: ${path}`);
    return readFileSync(path, { encoding: 'utf-8' });
  }

  static writeFile(path: string, data: string) {
    if (!existsSync(path)) throw new Error(`Path not found: ${path}`);
    writeFileSync(path, data, { encoding: 'utf-8' });
  }

  static readDir(path: string) {
    if (!existsSync(path)) throw new Error(`Path not found: ${path}`);
    return readdirSync(path, { encoding: 'utf-8' });
  }

  static copy(pathFrom: string, pathTo: string) {
    if (!existsSync(pathFrom)) throw new Error(`Path not found: ${pathFrom}`);
    if (!existsSync(pathTo)) this.createFolder(pathTo.replaceAll(/[\w-]+\.[A-Za-z0-9]{2,5}/g, ''));

    copyFileSync(pathFrom, pathTo);
  }
}
