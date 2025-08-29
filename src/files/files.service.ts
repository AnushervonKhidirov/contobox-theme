import type { FileData, FileType, FileDataWithStyles } from './file.type';

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

const cssFiles: FileData[] = [
  {
    localFileName: 'desktop.css',
    serverFileName: 'lyt-desktop.css',
    type: 'desktop',
    themeType: 'expansion',
  },
  {
    localFileName: 'styles-exp.css',
    serverFileName: 'styles.css',
    type: 'desktop',
    themeType: 'expansion',
  },

  {
    localFileName: 'mobile.css',
    serverFileName: 'lyt-mobile.css',
    type: 'mobile',
    themeType: 'expansion',
  },
  {
    localFileName: 'styles-exp.css',
    serverFileName: 'styles.css',
    type: 'mobile',
    themeType: 'expansion',
  },

  {
    localFileName: 'styles-fallback.css',
    serverFileName: 'styles-fallback.css',
    type: 'fallback',
    themeType: 'banner',
  },
  {
    localFileName: '300x600-fallback.css',
    serverFileName: 'fmt-300x600-fallback.css',
    type: 'fallback',
    themeType: 'banner',
  },
  {
    localFileName: '160x600-fallback.css',
    serverFileName: 'fmt-160x600-fallback.css',
    type: 'fallback',
    themeType: 'banner',
  },
  {
    localFileName: '300x250-fallback.css',
    serverFileName: 'fmt-300x250-fallback.css',
    type: 'fallback',
    themeType: 'banner',
  },
  {
    localFileName: '728x90-fallback.css',
    serverFileName: 'fmt-728x90-fallback.css',
    type: 'fallback',
    themeType: 'banner',
  },
  {
    localFileName: '970x250-fallback.css',
    serverFileName: 'fmt-970x250-fallback.css',
    type: 'fallback',
    themeType: 'banner',
  },

  {
    localFileName: 'styles-banner.css',
    serverFileName: 'styles.css',
    type: 'banner',
    themeType: 'banner',
  },
  {
    localFileName: '300x600-banner.css',
    serverFileName: 'fmt-300x600.css',
    type: 'banner',
    themeType: 'banner',
  },
  {
    localFileName: '160x600-banner.css',
    serverFileName: 'fmt-160x600.css',
    type: 'banner',
    themeType: 'banner',
  },
  {
    localFileName: '300x250-banner.css',
    serverFileName: 'fmt-300x250.css',
    type: 'banner',
    themeType: 'banner',
  },
  {
    localFileName: '728x90-banner.css',
    serverFileName: 'fmt-728x90.css',
    type: 'banner',
    themeType: 'banner',
  },
  {
    localFileName: '970x250-banner.css',
    serverFileName: 'fmt-970x250.css',
    type: 'banner',
    themeType: 'banner',
  },
];

export class FileService {
  private readonly themeFolderPath: string;
  private readonly themeName: string;
  private readonly cssWorkingPath: string;
  private readonly cssTemplatePath: string;
  private readonly fileTypes: FileType[];
  readonly workingFiles: FileData[];

  constructor(themeName: string, fileTypes: FileType[]) {
    this.themeFolderPath = resolve(process.cwd(), 'contoboxes');
    this.cssTemplatePath = resolve(process.cwd(), 'src', 'templates');
    this.themeName = themeName;
    this.cssWorkingPath = resolve(this.themeFolderPath, this.themeName);

    this.fileTypes = fileTypes;
    this.workingFiles = cssFiles.filter(file => this.fileTypes.includes(file.type));
  }

  createFolder(dirname: string) {
    if (!existsSync(dirname)) mkdirSync(dirname, { recursive: true });
  }

  createFiles(filesDataWithStyles?: FileDataWithStyles[]) {
    this.createFolder(this.cssWorkingPath);

    const filesData: (FileDataWithStyles | FileData)[] = filesDataWithStyles || this.workingFiles;

    filesData.forEach(file => {
      const templateFilePath = resolve(this.cssTemplatePath, file.localFileName);
      const destFilePath = resolve(this.cssWorkingPath, file.localFileName);

      copyFileSync(templateFilePath, destFilePath);

      if ('styles' in file) this.writeFile(file);
    });
  }

  readFile(fileName: string) {
    const filePath = resolve(this.cssWorkingPath, fileName);

    if (!existsSync(filePath)) {
      Message.error(`${fileName} not found`);
      return '';
    }

    return readFileSync(filePath, { encoding: 'utf-8' });
  }

  writeFile(fileData: FileDataWithStyles) {
    const filePath = resolve(this.cssWorkingPath, fileData.localFileName);

    if (!existsSync(filePath)) {
      Message.error(`${fileData.localFileName} not found`);
    }

    writeFileSync(filePath, fileData.styles, { encoding: 'utf-8' });
  }

  readWorkDir() {
    return readdirSync(this.cssWorkingPath, { encoding: 'utf-8' });
  }

  watchWorkDir(callback: (fileData: FileDataWithStyles) => Promise<void>) {
    const workDirFiles = this.readWorkDir();

    workDirFiles.forEach(fileName => {
      const path = resolve(this.cssWorkingPath, fileName);

      watch(path, () => {
        const file = this.getFileDataWithStyles(fileName);
        if (file) callback(file);
      });
    });
  }

  getAllFilesDataFromWorkDir() {
    const workDirFiles = this.readWorkDir();
    const workDitFilesData: FileDataWithStyles[] = [];

    workDirFiles.forEach(fileName => {
      const fileData = this.getFileDataWithStyles(fileName);
      if (fileData) workDitFilesData.push(fileData);
    });

    return workDitFilesData;
  }

  getFileDataWithStyles(fileName: string): FileDataWithStyles | null {
    const fileData = this.getFileDataByLocalFileName(fileName);

    if (!fileData) return null;
    return { ...fileData, styles: this.readFile(fileData.localFileName) };
  }

  getFileDataByLocalFileName(localFileName: string) {
    return this.workingFiles.find(file => file.localFileName === localFileName);
  }
}
