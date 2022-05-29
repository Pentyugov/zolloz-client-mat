import {User} from "./user";
import {Ticket} from "./ticket";
import {Contractor} from "./contractor";

export class Project {
  id: string;
  name: string;
  code: string;
  status: number;
  projectManager: User | null;
  client: Contractor | null;
  tickets: Ticket[];
  participants: User[] = [];

  constructor() {
    this.id = '';
    this.name = '';
    this.code = '';
    this.projectManager = null;
    this.client = null;
    this.participants = [];
    this.tickets = [];
    this.status = 0;
  }
}
