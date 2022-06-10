import {Role} from "./role";

export class ScreenPermissions {
  screen: string;
  role: Role | undefined;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;

  constructor() {
    this.screen = '';
    this.create = false;
    this.read = false;
    this.update = false;
    this.delete = false;
  }
}
