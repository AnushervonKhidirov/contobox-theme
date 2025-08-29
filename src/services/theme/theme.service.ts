import type { FileData, FileDataWithStyles } from '../contobox-files/contobox-files.type';

import { Cookie } from 'bun';
import { FileService } from '../files/files.service';
import { Logger } from '../../logger/logger';

import { SID_DIR, PULL_THEME_ENDPOINT, PUSH_THEME_ENDPOINT } from '../../constant';

type RequestBodyData = FileData & Partial<FileDataWithStyles>;

export class ThemeService {
  private readonly SID: string = FileService.readFile(SID_DIR);
  private readonly themeName: string;

  constructor(themeName: string) {
    this.themeName = this.convertThemeName(themeName);
  }

  async pull(fileData: FileData) {
    const response = await fetch(PULL_THEME_ENDPOINT, {
      method: 'POST',
      body: this.getRequestBody(fileData),
      headers: {
        cookie: new Cookie('SID', this.SID).serialize(),
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });

    const isError = response.redirected;

    if (isError) {
      Logger.error(
        'Error while pulling',
        `${fileData.serverFileName} (${fileData.themeType})`,
        true,
      );

      return '';
    } else {
      const data = (await response.json()) as { media: string };
      Logger.done('Pulled', `${fileData.serverFileName} (${fileData.themeType})`, true);
      return data.media;
    }
  }

  async push(fileData: FileDataWithStyles) {
    const response = await fetch(PUSH_THEME_ENDPOINT, {
      method: 'POST',
      body: this.getRequestBody(fileData),
      headers: {
        cookie: new Cookie('SID', this.SID).serialize(),
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });

    const isError = response.redirected;

    if (isError) {
      Logger.error(
        'Error while pushing',
        `${fileData.serverFileName} (${fileData.themeType})`,
        true,
      );
    } else {
      Logger.done('Pushed', `${fileData.serverFileName} (${fileData.themeType})`, true);
    }
  }

  async pushMany(files: FileDataWithStyles[]) {
    await nextFile.call(this);

    async function nextFile(this: ThemeService, curr = files.length - 1) {
      if (curr !== 0) await nextFile.call(this, curr - 1);

      const fileData = files[curr];
      if (fileData) await this.push(fileData);
    }
  }

  async pullMany(files: FileData[]) {
    const pulledFilesData: FileDataWithStyles[] = [];

    await nextFile.call(this);

    async function nextFile(this: ThemeService, curr = files.length - 1) {
      if (curr !== 0) await nextFile.call(this, curr - 1);

      const fileData = files[curr];

      if (fileData) {
        const styles = (await this.pull(fileData)) ?? '';
        pulledFilesData.push({ ...fileData, styles });
      }
    }

    return pulledFilesData;
  }

  private convertThemeName(name: string) {
    return name.replaceAll(' ', '_').toLowerCase();
  }

  private getRequestBody({ themeType, serverFileName, styles }: RequestBodyData) {
    const body = `file=cbox_themes_v3/${this.themeName}/styles/${themeType}/${serverFileName}`;
    return styles ? body + `&style=${encodeURIComponent(styles)}` : body;
  }
}
