import type { FileData, FileDataWithStyles, FileType } from './contobox-files.type';

import { resolve } from 'path';
import { FileService } from '../files/files.service';

import { WORKING_DIR, TEMPLATE_DIR } from '../../constant';
import { cssFiles } from './constant';

export class ContoboxFilesService {
  private readonly themeName: string;
  private readonly fileTypes: FileType[];

  readonly cssWorkingDir: string;
  readonly workingFiles: FileData[];

  constructor(themeName: string, fileTypes: FileType[]) {
    this.themeName = themeName;
    this.fileTypes = fileTypes;

    this.cssWorkingDir = resolve(WORKING_DIR, this.themeName);
    this.workingFiles = cssFiles.filter(file => this.fileTypes.includes(file.type));
  }

  createFiles(filesDataWithStyles?: FileDataWithStyles[]) {
    const filesData: (FileDataWithStyles | FileData)[] = filesDataWithStyles || this.workingFiles;

    filesData.forEach(file => {
      const templateFilePath = resolve(TEMPLATE_DIR, file.localFileName);
      const destFilePath = resolve(this.cssWorkingDir, file.localFileName);

      FileService.copy(templateFilePath, destFilePath);

      if ('styles' in file) FileService.writeFile(destFilePath, file.styles);
    });
  }

  getAllFilesData() {
    const fileNames = FileService.readDir(this.cssWorkingDir);

    const workDitFilesData: FileData[] = [];

    fileNames.forEach(fileName => {
      const fileData = this.getFileData(fileName);
      if (fileData) workDitFilesData.push(fileData);
    });

    return workDitFilesData;
  }

  getAllFilesDataWithStyles() {
    const fileNames = FileService.readDir(this.cssWorkingDir);

    const workDitFilesData: FileDataWithStyles[] = [];

    fileNames.forEach(fileName => {
      const fileData = this.getFileDataWithStyles(fileName);
      if (fileData) workDitFilesData.push(fileData);
    });

    return workDitFilesData;
  }

  getFileData(fileName: string): FileData | null {
    const fileData = this.getFileDataByLocalFileName(fileName);
    if (!fileData) return null;
    return fileData;
  }

  getFileDataWithStyles(fileName: string): FileDataWithStyles | null {
    const fileData = this.getFileDataByLocalFileName(fileName);
    if (!fileData) return null;

    const filePath = resolve(this.cssWorkingDir, fileData.localFileName);
    return { ...fileData, styles: FileService.readFile(filePath) };
  }

  getFileDataByLocalFileName(localFileName: string) {
    return this.workingFiles.find(file => file.localFileName === localFileName);
  }
}
