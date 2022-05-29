import {Project} from "./project";
import {User} from "./user";

export class Ticket {
  title: string ;
  description: string;
  project: Project | null;
  creator: User | null;
  assignee: User | null;
  status: number;
  executionDatePlan: Date;
  executionDateFact: Date;

  constructor() {
    this.title = '';
    this.description = '';
    this.project = null;
    this.creator = null;
    this.assignee = null;
    this.status = 0;
    this.executionDatePlan = new Date();
    this.executionDateFact = new Date();
  }

}
