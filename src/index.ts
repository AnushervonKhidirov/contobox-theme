import type { StylesFrom } from './type';
import type { FileType } from './files/file.type';
import type { AuthOptions } from './auth/auth.type';
import type { ThemeOptions } from './theme/theme.type';

import { resolve } from 'path';
import { input, select, checkbox, confirm } from '@inquirer/prompts';

import { AuthService } from './auth/auth.service';
import { ThemeService } from './theme/theme.service';
import { FileService } from './files/files.service';

import { Message } from './message/message';

type ProgramOptions = {
  auth: AuthOptions;
  theme: Omit<ThemeOptions, 'SID' | 'themeName'>;
};

class Program {
  // options
  options: ProgramOptions;
  SID: string | null;

  // services
  private readonly authService: AuthService;
  private themeService: ThemeService | null;
  private fileService: FileService | null;

  private readonly stylesFromList: StylesFrom[];
  private readonly availableTypesList: FileType[];

  private stylesFrom: StylesFrom | null;
  private contoboxTypes: FileType[] | null;
  private io: number | null;
  private themeName: string | null;
  private themeFolderName: string | null;

  constructor(options: ProgramOptions) {
    // options
    this.options = options;
    this.SID = null;

    // services
    this.authService = new AuthService(this.options.auth);
    this.themeService = null;
    this.fileService = null;

    this.stylesFromList = ['server', 'local'];
    this.availableTypesList = ['desktop', 'mobile', 'fallback', 'banner'];

    this.stylesFrom = null;
    this.contoboxTypes = null;
    this.io = null;
    this.themeName = null;
    this.themeFolderName = null;
  }

  async init() {
    await this.start();

    await this.logIn();

    this.initThemeService();
    this.initFileService();

    if (this.stylesFrom === 'server') {
      await this.loadFromServer();
    } else {
      await this.loadFromLocal();
    }

    this.startWatchingFiles();
  }

  private async start() {
    this.stylesFrom = await select<StylesFrom>({
      message: `Get style from:`,
      choices: this.stylesFromList,
    });

    this.contoboxTypes = await checkbox<FileType>({
      message: `Contobox type:`,
      choices: this.availableTypesList,
      required: true,
    });

    this.io = parseInt(await input({ message: 'Contobox IO:', required: true }));
    this.themeName = await input({ message: 'Theme name:', required: true });

    const confirmed = await confirm({ message: 'Do you want to continue?', default: false });

    if (!confirmed) process.exit();

    this.themeFolderName = `IO ${this.io} | ${this.themeName}`;

    Message.log(
      `"${this.themeFolderName}" will creating after successful login in path\nfile://${resolve(
        process.cwd(),
        'contoboxes',
      )} | Ctrl+Click to open folder`,
    );
  }

  private async logIn() {
    await this.authService.logIn();
    this.SID = this.authService.getSID();

    if (!this.SID) {
      throw 'Error while logging in, please check username/password';
    }
  }

  private initThemeService() {
    if (!this.themeName || !this.SID) {
      throw "Can't get theme name or SID!";
    }

    this.themeService = new ThemeService({
      ...this.options.theme,
      themeName: this.themeName,
      SID: this.SID,
    });
  }

  private initFileService() {
    if (!this.themeFolderName || !this.contoboxTypes) {
      throw "Can't get theme folder name or contobox types!";
    }

    this.fileService = new FileService(this.themeFolderName, this.contoboxTypes);
  }

  private async loadFromLocal() {
    if (!this.fileService) throw "Can't find file service";
    if (!this.themeService) throw "Can't find theme service";

    this.fileService.createFiles();
    const workingFiles = this.fileService.getAllFilesDataFromWorkDir();
    await this.themeService.pushMany(workingFiles);

    Message.log('All styles pushed successfully!');
  }

  private async loadFromServer() {
    if (!this.fileService) throw "Can't find file service";
    if (!this.themeService) throw "Can't find theme service";

    const pulledFilesData = await this.themeService.pullMany(this.fileService.workingFiles);
    this.fileService.createFiles(pulledFilesData);

    Message.log('All styles pulled successfully!');
  }

  private startWatchingFiles() {
    if (!this.fileService) throw "Can't find file service";
    if (!this.themeService) throw "Can't find theme service";

    this.fileService.watchWorkDir(this.themeService.push.bind(this.themeService));
  }
}

const authOptions: ProgramOptions['auth'] = {
  username: Bun.env.LOGIN!,
  password: Bun.env.PASSWORD!,
  endpoint: {
    login: Bun.env.LOGIN_ENDPOINT!,
  },
};

const themeOptions: ProgramOptions['theme'] = {
  endpoint: {
    pull: Bun.env.PULL_THEME_ENDPOINT!,
    push: Bun.env.PUSH_THEME_ENDPOINT!,
  },
};

const program = new Program({ auth: authOptions, theme: themeOptions });
program.init();
