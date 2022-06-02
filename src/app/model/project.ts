import {User} from "./user";
import {Ticket} from "./ticket";
import {Contractor} from "./contractor";

export class Project {
  id: string;
  name: string;
  code: string;
  status: number;
  projectManager: User | null;
  contractor: Contractor | null;
  closingDate: Date;
  dueDate: Date;
  conclusionDate: Date;
  tickets: Ticket[];
  participants: User[] = [];

  constructor() {
    this.id = '';
    this.name = '';
    this.code = '';
    this.projectManager = null;
    this.contractor = null;
    this.participants = [];
    this.tickets = [];
    this.status = 0;
    this.closingDate = new Date();
    this.dueDate = new Date();
    this.conclusionDate = new Date();
  }
}
