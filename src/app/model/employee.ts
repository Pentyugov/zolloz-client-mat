import {Department} from "./department";
import {Position} from "./position";
import {User} from "./user";
import {Entity} from "./entity";
import {ApplicationConstants} from "../modules/shared/application-constants";

export class Employee extends Entity {
  firstName: string;
  lastName: string;
  middleName: string;
  salary: number
  phoneNumber: string;
  email: string;
  hireDate: Date | null;
  dismissalDate: Date | null;
  head: boolean;
  personnelNumber: number;
  user: User | null | undefined;
  position: Position | null | undefined;
  department: Department | null | undefined;

  constructor() {
    super(ApplicationConstants.EMPLOYEE)
    this.firstName = '';
    this.lastName = '';
    this.middleName = '';
    this.salary = 0;
    this.phoneNumber = '';
    this.email = '';
    this.hireDate = null;
    this.dismissalDate = null;
    this.head = false;
    this.personnelNumber = 0;
    this.user = null;
    this.position = null;
    this.department = null;
  }
}
