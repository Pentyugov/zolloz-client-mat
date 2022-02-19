export class Department {
  id: string;
  name: string;
  code: string;
  head: boolean;
  level: number;
  parentDepartment: Department | null | undefined;

  constructor() {
    this.id = '';
    this.name = '';
    this.code = '';
    this.head = false;
    this.level = 1;
    this.parentDepartment = null;
  }
}
