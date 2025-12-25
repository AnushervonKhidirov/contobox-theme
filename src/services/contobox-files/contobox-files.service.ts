import type { FileData, FileDataWithStyles, FileType } from './contobox-files.type';

import { resolve } from 'node:path';
import { FileService } from '../files/files.service';

import { WORKING_DIR, TEMPLATE_DIR, TEMPLATE_DIR_NESTING } from '../../constant';
import { cssFiles } from './constant';

export class ContoboxFilesService {
  private readonly themeName: string;
  private readonly fileTypes: FileType[];

  readonly cssTemplateDir: string;
  readonly cssWorkingDir: string;
  readonly workingFiles: FileData[];

  constructor(themeName: string, fileTypes: FileType[], withNesting: boolean = false) {
    this.themeName = themeName;
    this.fileTypes = fileTypes;

    this.cssTemplateDir = withNesting ? TEMPLATE_DIR_NESTING : TEMPLATE_DIR;
    this.cssWorkingDir = resolve(WORKING_DIR, this.themeName);
    this.workingFiles = cssFiles.filter(file => this.fileTypes.includes(file.type));
  }

  createFiles(filesDataWithStyles?: FileDataWithStyles[]) {
    const filesData: (FileDataWithStyles | FileData)[] = filesDataWithStyles || this.workingFiles;

    for (const file of filesData) {
      const templateFilePath = resolve(this.cssTemplateDir, file.localFileName);
      const destFilePath = resolve(this.cssWorkingDir, file.localFileName);

      FileService.copy(templateFilePath, destFilePath);

      if ('styles' in file) FileService.writeFile(destFilePath, file.styles);
    }
  }

  getAllFilesData() {
    const fileNames = FileService.readDir(this.cssWorkingDir);

    const workDitFilesData: FileData[] = [];

    for (const fileName of fileNames) {
      const fileData = this.getFileData(fileName);
      if (fileData) workDitFilesData.push(fileData);
    }

    return workDitFilesData;
  }

  getAllFilesDataWithStyles() {
    const fileNames = FileService.readDir(this.cssWorkingDir);

    const workDitFilesData: FileDataWithStyles[] = [];

    for (const fileName of fileNames) {
      const fileData = this.getFileDataWithStyles(fileName);
      if (fileData) workDitFilesData.push(fileData);
    }

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
