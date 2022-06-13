import {User} from "./user";

export class Task {
  static PRIORITY_LOW:    string = 'PRIORITY$LOW';
  static PRIORITY_MEDIUM: string = 'PRIORITY$MEDIUM';
  static PRIORITY_HIGH:   string = 'PRIORITY$HIGH';

  static STATE_CREATED  = "CREATED";
  static STATE_ASSIGNED = "ASSIGNED";
  static STATE_FINISHED = "FINISHED";
  static STATE_CLOSED   = "CLOSED";
  static STATE_CANCELED = "CANCELED";
  static STATE_EXECUTED = "EXECUTED";
  static STATE_REWORK   = "REWORK";

  id: string;
  priority: string;
  number: string;
  description: string;
  comment: string;
  state: string;
  executionDatePlan: Date | null;
  executionDateFact: Date | null;
  creator: User | null;
  executor: User | null | undefined;
  initiator: User | null;
  daysUntilDueDate: number;
  started: boolean;
  overdue: boolean;


  constructor() {
    this.id = '';
    this.priority = '';
    this.number = '';
    this.description = '';
    this.comment = '';
    this.state = '';
    this.executionDatePlan = null;
    this.executionDateFact = null;
    this.creator = null;
    this.executor = null;
    this.initiator = null;
    this.daysUntilDueDate = 0;
    this.started = false;
    this.overdue = false;
  }
}
