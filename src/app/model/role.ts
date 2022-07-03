import {Permission} from "./permission";
import {Entity} from "./entity";
import {ApplicationConstants} from "../modules/shared/application-constants";

export class Role extends Entity {
  name: string;
  description: string;
  permissions: Permission[] | null;

  constructor() {
    super(ApplicationConstants.ROLE)
    this.name = '';
    this.description = '';
    this.permissions = null;
  }
}
