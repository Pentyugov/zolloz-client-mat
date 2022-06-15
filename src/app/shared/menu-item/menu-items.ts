import { Injectable } from '@angular/core';

export interface BadgeItem {
  type: string;
  value: string;
}
export interface Saperator {
  name: string;
  type?: string;
}
export interface SubChildren {
  state: string;
  name: string;
  type?: string;
}
export interface ChildrenItems {
  state: string;
  name: string;
  screen?: string;
  type?: string;
  child?: SubChildren[];
}

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  saperator?: Saperator[];
  children?: ChildrenItems[];
}

const MENUITEMS = [
  {
    state: 'home',
    name: 'Home',
    type: 'link',
    icon: 'home',
  },
  {
    state: 'organization',
    name: 'Organization',
    type: 'sub',
    icon: 'domain',
    children: [
      { state: 'departments', name: 'Departments', type: 'link' },
      { state: 'employees', name: 'Employees', type: 'link' },
      { state: 'positions', name: 'Positions', type: 'link' },
      { state: 'users', name: 'Users', type: 'link' },
      { state: 'roles', name: 'Roles', type: 'link' },
    ],
  },

  {
    state: 'workflow',
    name: 'MyProjects',
    type: 'sub',
    icon: 'folder',
    screen: '',
    children: [
      { state: 'projects', name: 'Projects', type: 'link', screen: 'screen$Projects.Browse' },
      { state: 'tasks', name: 'Tasks', type: 'link' },
      { state: 'tickets', name: 'Tickets', type: 'link' },
      { state: 'taskboard', name: 'Taskboard', type: 'link' },
      { state: 'notes', name: 'Notes', type: 'link' },
      { state: 'todo', name: 'Todo', type: 'link' },
    ],
  },

  {
    state: 'applications',
    name: 'Applications',
    type: 'sub',
    icon: 'apps',
    screen: '',
    children: [
      { state: 'chat', name: 'Chat', type: 'link', screen: 'screen$Chat.Browse' },
    ],
  },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
