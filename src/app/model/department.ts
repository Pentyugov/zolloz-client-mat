import {Entity} from "./entity";
import {ApplicationConstants} from "../modules/shared/application-constants";

export class Department extends Entity{

  name: string;
  code: string;
  head: boolean;
  level: number;
  parentDepartment: Department | null | undefined;

  constructor() {
    super(ApplicationConstants.DEPARTMENT)
    this.name = '';
    this.code = '';
    this.head = false;
    this.level = 1;
    this.parentDepartment = null;
  }
}
