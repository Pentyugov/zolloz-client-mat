export class ApplicationConstants {

  static readonly DIALOG_ACTION_ADD = 'Add';
  static readonly DIALOG_ACTION_UPDATE = 'Update';
  static readonly DIALOG_ACTION_DELETE = 'Delete';
  static readonly DIALOG_ACTION_CANCEL = 'Cancel';
  static readonly DIALOG_ACTION_SAVE = 'Save';


  static readonly DEFAULT_ROLE = 'USER';

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
