import {User} from "./user";
import {Ticket} from "./ticket";
import {Contractor} from "./contractor";

export class Project {
  id: string;
  name: string;
  code: string;
  status: number | null;
  projectManager: User | null | undefined;
  contractor: Contractor | null | undefined;
  closingDate: Date;
  dueDate: Date;
  conclusionDate: Date;
  participants: User[] = [];

  constructor() {
    this.id = '';
    this.name = '';
    this.code = '';
    this.projectManager = null;
    this.contractor = null;
    this.participants = [];
    this.status = null;
    this.closingDate = new Date();
    this.dueDate = new Date();
    this.conclusionDate = new Date();
  }
}
