import {User} from "./user";
import {Entity} from "./entity";
import {ApplicationConstants} from "../modules/shared/application-constants";

export class Task extends Entity {
  static PRIORITY_LOW:    string = 'PRIORITY$LOW';
  static PRIORITY_MEDIUM: string = 'PRIORITY$MEDIUM';
  static PRIORITY_HIGH:   string = 'PRIORITY$HIGH';

  static STATE_CREATED  = "TS$CREATED";
  static STATE_ASSIGNED = "TS$ASSIGNED";
  static STATE_FINISHED = "TS$FINISHED";
  static STATE_CLOSED   = "TS$CLOSED";
  static STATE_CANCELED = "TS$CANCELED";
  static STATE_EXECUTED = "TS$EXECUTED";
  static STATE_REWORK   = "TS$REWORK";

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
    super(ApplicationConstants.TASK);
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
