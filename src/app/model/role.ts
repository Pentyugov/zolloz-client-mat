import {Permission} from "./permission";

export class Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[] | null;

  constructor() {
    this.id = '';
    this.name = '';
    this.description = '';
    this.permissions = null;
  }
}
