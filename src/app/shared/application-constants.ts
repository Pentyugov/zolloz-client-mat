export class ApplicationConstants {

//    ==============================================================
//    =                        Dialog params                       =
//    ==============================================================
  static readonly DIALOG_WIDTH = '600px';
  static readonly DIALOG_ACTION_ADD = 'Add';
  static readonly DIALOG_ACTION_UPDATE = 'Update';
  static readonly DIALOG_ACTION_DELETE = 'Delete';
  static readonly DIALOG_ACTION_CANCEL = 'Cancel';
  static readonly DIALOG_ACTION_SAVE = 'Save';

//    ==============================================================
//    =                        Table columns                       =
//    ==============================================================
  static readonly USER_TABLE_COLUMNS = ['number', 'profileImage', 'username', 'firstName', 'lastName', 'email', 'action'];
  static readonly ROLE_TABLE_COLUMNS = ['number', 'name', 'description', 'permissions', 'action', ];
  static readonly DEPARTMENT_TABLE_COLUMNS = ['number', 'name', 'parentDept', 'code', 'head', 'action'];


  static readonly DEFAULT_ROLE = 'USER';

//    ==============================================================
//    =                         Notifications                      =
//    ==============================================================
  static readonly NOTIFICATION_TITLE_SUCCESS = 'Success';
  static readonly NOTIFICATION_TITLE_ERROR = 'Error';

//    ==============================================================
//    =                            Locales                         =
//    ==============================================================
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
