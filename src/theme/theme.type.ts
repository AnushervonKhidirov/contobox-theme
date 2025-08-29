export type ThemeOptions = {
  SID: string;
  endpoint: {
    pull: string;
    push: string;
  };
  themeName: string;
};

export type ThemeType = 'expansion' | 'banner';
