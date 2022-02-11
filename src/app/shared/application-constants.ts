export class ApplicationConstants {

  static readonly APP_DEFAULT_LOCALE: Locale = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: 'us',
  };

  static readonly APP_LOCALES: Locale [] = [
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: 'us',
    },
    {
      language: 'Russian',
      code: 'ru',
      type: 'RU',
      icon: 'ru',
    },
  ];
}

export interface Locale {
  language: string,
  code: string,
  type: string,
  icon: string,
}
