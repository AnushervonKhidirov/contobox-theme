import type { FileData, FileDataWithStyles } from '../files/file.type';
import type { ThemeOptions } from './theme.type';

import { Message } from '../message/message';

export class ThemeService {
  private readonly pullEndpoint: string;
  private readonly pushEndpoint: string;
  private readonly SID: string;

  private readonly themeName: string;

  constructor({ SID, endpoint, themeName }: ThemeOptions) {
    this.SID = SID;
    this.pullEndpoint = endpoint.pull;
    this.pushEndpoint = endpoint.push;

    this.themeName = this.convertThemeName(themeName);
  }

  async pull({ serverFileName, themeType }: FileData) {
    try {
      const response = await fetch(this.pullEndpoint, {
        method: 'POST',
        body: `file=cbox_themes_v3/${this.themeName}/styles/${themeType}/${serverFileName}`,
        headers: {
          cookie: `SID=${this.SID}`,
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      });

      const data = (await response.json()) as { media: string };

      Message.log(`${serverFileName} (${themeType}) pulled successfully!`, true);
      return data.media;
    } catch (err: any) {
      Message.error(err.message);
    }
  }

  async push({ serverFileName, themeType, styles }: FileDataWithStyles) {
    await fetch(this.pushEndpoint, {
      method: 'POST',
      body: `file=cbox_themes_v3/${
        this.themeName
      }/styles/${themeType}/${serverFileName}&style=${encodeURIComponent(styles)}`,
      headers: {
        cookie: `SID=${this.SID}`,
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });

    Message.log(`${serverFileName} (${themeType}) pushed successfully!`, true);
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
}
