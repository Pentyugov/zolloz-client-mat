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
  static readonly DIALOG_ACTION_APPLY = 'Apply';
  static readonly THEME_DARK_MODE_CLASS = 'dark';

//    ==============================================================
//    =                        Table columns                       =
//    ==============================================================
  static readonly USER_TABLE_COLUMNS = ['number',
                                        'profileImage',
                                        'username',
                                        'firstName',
                                        'lastName',
                                        'email',
                                        'action'];

  static readonly EMPLOYEES_TABLE_COLUMNS = ['name',
                                             'department',
                                             'phoneNumber',
                                             'email',
                                             'personnelNumber'];

  static readonly ROLE_TABLE_COLUMNS = ['number',
                                        'name',
                                        'description',
                                        'permissions',
                                        'action', ];

  static readonly DEPARTMENT_TABLE_COLUMNS = ['number',
                                              'name',
                                              'parentDept',
                                              'code',
                                              'head'];

  static readonly POSITION_TABLE_COLUMNS = ['number',
                                            'name',
                                            'code',
                                            'action'];

  static readonly PROJECT_TABLE_COLUMNS = ['name',
                                           'code',
                                           'projectManager',
                                           'client',
                                           'status'];

  static readonly PROJECT_PARTICIPANTS_TABLE_COLUMNS = ['number',
                                                        'firstName',
                                                        'lastName',
                                                        'username',
                                                        'email',];


  static readonly DEFAULT_ROLE = 'USER';

//    ==============================================================
//    =                         Notifications                      =
//    ==============================================================
  static readonly NOTIFICATION_TITLE_SUCCESS = 'Success';
  static readonly NOTIFICATION_TITLE_ERROR = 'Error';

  static readonly NOTIFICATION_TYPE_SUCCESS = 10;
  static readonly NOTIFICATION_TYPE_INFO = 20;
  static readonly NOTIFICATION_TYPE_WARNING = 30;
  static readonly NOTIFICATION_TYPE_DANGER = 40;

  static readonly NOTIFICATION_ACCESSORY_SYSTEM = 10;
  static readonly NOTIFICATION_ACCESSORY_CALENDAR = 20;
  static readonly NOTIFICATION_ACCESSORY_TODO = 30;
  static readonly NOTIFICATION_ACCESSORY_WORKFLOW = 40;
//    ==============================================================
//    =                         PROJECTS                           =
//    ==============================================================
  static readonly PROJECT_STATUSES = [
    {
      code: 10,
      status: 'Status.Open',
    },

    {
      code: 20,
      status: 'Status.InProgress',
    },

    {
      code: 30,
      status: 'Status.Closed',
    },
  ]

//    ==============================================================
//    =                      PERMISSIONS                           =
//    ==============================================================
  static readonly PERMISSION_READ = 'READ';
  static readonly PERMISSION_DELETE = 'DELETE';
  static readonly PERMISSION_CREATE = 'CREATE';
  static readonly PERMISSION_UPDATE = 'UPDATE';
  static readonly PERMISSION_SEND_SYS_MAIL = 'SEND_SYS_MAIL';
  static readonly PERMISSION_CREATE_PROJECT = 'CREATE_PROJECT';
  static readonly PERMISSION_DELETE_PROJECT = 'DELETE_PROJECT';
  static readonly PERMISSION_EDIT_PROJECT = 'EDIT_PROJECT';

//    ==============================================================
//    =                            ROLES                           =
//    ==============================================================
  static readonly ROLE_ADMIN = 'ADMIN';
  static readonly ROLE_USER = 'USER';
  static readonly ROLE_SECRETARY = 'SECRETARY';
  static readonly ROLE_PROJECT_MANAGER = 'PROJECT_MANAGER';


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
