import {User} from "./user";
import {Ticket} from "./ticket";
import {Contractor} from "./contractor";
import {Entity} from "./entity";
import {ApplicationConstants} from "../modules/shared/application-constants";

export class Project extends Entity {
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
    super(ApplicationConstants.PROJECT)
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
