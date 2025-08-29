import type { ThemeType } from '../theme/theme.type';

export type FileData = {
  localFileName: string;
  serverFileName: string;
  type: FileType;
  themeType: ThemeType;
};

export type FileDataWithStyles = FileData & {
  styles: string;
};

export type FileType = 'desktop' | 'mobile' | 'fallback' | 'banner';
