import {User} from "../model/user";

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
                                        'email'];

  static readonly EMPLOYEES_TABLE_COLUMNS = ['name',
                                             'department',
                                             'phoneNumber',
                                             'email',
                                             'personnelNumber'];

  static readonly ROLE_TABLE_COLUMNS = ['number',
                                        'name',
                                        'description',
                                        'permissions'];

  static readonly DEPARTMENT_TABLE_COLUMNS = ['number',
                                              'name',
                                              'parentDept',
                                              'code',
                                              'head'];

  static readonly POSITION_TABLE_COLUMNS = ['number',
                                            'name',
                                            'code'];

  static readonly PROJECT_TABLE_COLUMNS = ['name',
                                           'code',
                                           'projectManager',
                                           'client',
                                           'status'];

  static readonly TASK_TABLE_COLUMNS = ['number',
    'state',
    'priority',
    'dueDate',
    'executionDateFact',
    'initiator',
    'executor'];

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
//    =                          TASKS                             =
//    ==============================================================
  static readonly PRIORITY_LOW:    string = 'PRIORITY$LOW';
  static readonly PRIORITY_MEDIUM: string = 'PRIORITY$MEDIUM';
  static readonly PRIORITY_HIGH:   string = 'PRIORITY$HIGH';

  static readonly TASK_PRIORITIES = [
    {
      code: 'PRIORITY$LOW',
      name: 'Priority.Low',
    },

    {
      code: 'PRIORITY$MEDIUM',
      name: 'Priority.Medium',
    },

    {
      code: 'PRIORITY$HIGH',
      name: 'Priority.High',
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
//    =                     SCREENS ACTIONS                        =
//    ==============================================================

  static readonly SCREEN_ACTION_BROWSE = "Browse";
  static readonly SCREEN_ACTION_CREATE = "Create";
  static readonly SCREEN_ACTION_EDIT = "Edit";
  static readonly SCREEN_ACTION_DELETE = "Delete";

//    ==============================================================
//    =                            ROLES                           =
//    ==============================================================
  static readonly ROLE_ADMIN = 'ADMIN';
  static readonly ROLE_USER = 'USER';
  static readonly ROLE_SECRETARY = 'SECRETARY';
  static readonly ROLE_PROJECT_MANAGER = 'PROJECT_MANAGER';
  static readonly ROLE_PROJECT_PARTICIPANT = 'PROJECT_PARTICIPANT';
  static readonly ROLE_TASK_INITIATOR = 'TASK_INITIATOR';
  static readonly ROLE_TASK_EXECUTOR = 'TASK_EXECUTOR';


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
