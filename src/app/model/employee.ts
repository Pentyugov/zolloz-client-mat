import {Department} from "./department";

export class Employee {
  id: string;
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
  userId: string;
  positionId: string;
  department: Department | null | undefined;

  constructor() {
    this.id = '';
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
    this.userId = '';
    this.positionId = '';
    this.department = null;
  }
}
