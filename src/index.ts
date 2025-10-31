import type { StylesFrom } from './type';
import type { FileType } from './services/contobox-files/contobox-files.type';

import { resolve } from 'path';
import { exec } from 'child_process';
import { input, select, checkbox, confirm } from '@inquirer/prompts';
import { existsSync, watch } from 'fs';

import { FileService } from './services/files/files.service';
import { AuthService } from './services/auth/auth.service';
import { ContoboxFilesService } from './services/contobox-files/contobox-files.service';
import { ThemeService } from './services/theme/theme.service';

import { RELOGIN_TIMEOUT, WORKING_DIR, ASSETS_DIR, SID_DIR } from './constant';

class Program {
  private readonly authService: AuthService;
  private contoboxFilesService: ContoboxFilesService | null = null;
  private themeService: ThemeService | null = null;

  private readonly stylesFromList: StylesFrom[];
  private readonly availableTypesList: FileType[];

  private stylesFrom: StylesFrom | null = null;
  private contoboxFileTypes: FileType[] | null = null;
  private io: number | null = null;
  private themeName: string | null = null;
  private themeFolderName: string | null = null;

  private loginTimerId: NodeJS.Timeout | null = null;

  constructor() {
    this.authService = new AuthService();

    this.stylesFromList = ['server', 'local'];
    this.availableTypesList = ['desktop', 'mobile', 'fallback', 'banner', 'ironsource'];
  }

  async init() {
    FileService.createFile(SID_DIR, '', { showError: false });

    await this.authService.logIn();
    await this.start();

    this.initThemeService();
    this.initContoboxFilesService();

    if (this.stylesFrom === 'server') {
      await this.loadFromServer();
    } else {
      await this.loadFromLocal();
    }

    this.watchFiles();
  }

  private async reLoginIfNoActive() {
    if (this.loginTimerId) clearTimeout(this.loginTimerId);

    this.loginTimerId = setTimeout(() => {
      this.authService.logIn(true);
      this.reLoginIfNoActive();
    }, RELOGIN_TIMEOUT);
  }

  private async start() {
    await this.askQuestions();

    const themeWorkingDir = resolve(WORKING_DIR, this.themeFolderName!);

    await this.createWorkingDir(themeWorkingDir);
    await this.openWorkDir(themeWorkingDir);
  }

  private async askQuestions() {
    this.stylesFrom = await select<StylesFrom>({
      message: `Get style from:`,
      choices: this.stylesFromList,
    });

    this.contoboxFileTypes = await checkbox<FileType>({
      message: `Contobox type:`,
      choices: this.availableTypesList,
      required: true,
    });

    this.io = parseInt(await input({ message: 'Contobox IO:', required: true }));
    this.themeName = (await input({ message: 'Theme name:', required: true })).trim();

    this.themeFolderName = `IO ${this.io} | ${this.themeName}`;

    const confirmed = await confirm({
      message: `Folder "\x1b[36m${this.themeFolderName}\x1b[0m" will be created in path: \x1b[36m${WORKING_DIR}\x1b[0m.\n Do you want to continue?`,
      default: false,
    });

    if (!confirmed) process.exit();
  }

  private async createWorkingDir(dir: string) {
    const isExist = existsSync(dir);

    if (isExist) {
      const overwrite = await confirm({
        message: `Folder already exists\n Do you want to overwrite it?`,
        default: false,
      });

      if (!overwrite) process.exit();
    }

    FileService.createFolder(dir);
    FileService.createFolder(resolve(dir, '.vscode'));

    FileService.copy(
      resolve(ASSETS_DIR, '.vscode', 'settings.json'),
      resolve(dir, '.vscode', 'settings.json'),
    );
  }

  private async openWorkDir(dir: string) {
    const openIn = {
      None: '',
      Folder: 'open',
      VSCode: 'code',
      WebStorm: 'webstorm',
    };

    const openInSelected = await select<keyof typeof openIn>({
      message: `Open in:`,
      choices: Object.keys(openIn),
    });

    const cmd = openIn[openInSelected];

    if (cmd) exec(`${cmd} "${dir}"`);
  }

  private initThemeService() {
    if (!this.themeName) throw new Error('Theme name not found!');

    this.themeService = new ThemeService(this.themeName);
  }

  private initContoboxFilesService() {
    if (!this.themeFolderName) throw new Error('Theme folder name not found');
    if (!this.contoboxFileTypes) throw new Error('Contobox file types not found');

    this.contoboxFilesService = new ContoboxFilesService(
      this.themeFolderName,
      this.contoboxFileTypes,
    );
  }

  private async loadFromLocal() {
    if (!this.contoboxFilesService) throw new Error('ContoboxFilesService not found');
    if (!this.themeService) throw new Error('ThemeService not found');

    this.contoboxFilesService.createFiles();
    const workingFiles = this.contoboxFilesService.getAllFilesDataWithStyles();
    await this.themeService.pushMany(workingFiles);
  }

  private async loadFromServer() {
    if (!this.contoboxFilesService) throw new Error('ContoboxFilesService not found');
    if (!this.themeService) throw new Error('ThemeService not found');

    const pulledFilesData = await this.themeService.pullMany(
      this.contoboxFilesService.workingFiles,
    );
    this.contoboxFilesService.createFiles(pulledFilesData);
  }

  private watchFiles() {
    if (!this.contoboxFilesService) throw new Error('ContoboxFilesService not found');
    if (!this.themeService) throw new Error('ThemeService not found');

    const workDir = this.contoboxFilesService.cssWorkingDir;
    const workDirFileNames = FileService.readDir(workDir);

    this.reLoginIfNoActive();

    workDirFileNames.forEach(fileName => {
      const file = this.contoboxFilesService!.getFileData(fileName);

      if (file) {
        watch(resolve(workDir, file.localFileName), () => {
          const newFileData = this.contoboxFilesService!.getFileDataWithStyles(file.localFileName);
          if (newFileData) {
            this.themeService!.push(newFileData);
            this.reLoginIfNoActive();
          }
        });
      }
    });
  }
}

const program = new Program();
program.init();
