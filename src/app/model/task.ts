import {User} from "./user";
import {Entity} from "./entity";
import {ApplicationConstants} from "../modules/shared/application-constants";
import {Project} from "./project";

export class Task extends Entity {
  static readonly PRIORITY_LOW:    string = 'PRIORITY$LOW';
  static readonly PRIORITY_MEDIUM: string = 'PRIORITY$MEDIUM';
  static readonly PRIORITY_HIGH:   string = 'PRIORITY$HIGH';

  static readonly STATE_ACTIVE  = "TS$ACTIVE";
  static readonly STATE_CREATED  = "TS$CREATED";
  static readonly STATE_ASSIGNED = "TS$ASSIGNED";
  static readonly STATE_FINISHED = "TS$FINISHED";
  static readonly STATE_CLOSED   = "TS$CLOSED";
  static readonly STATE_CANCELED = "TS$CANCELED";
  static readonly STATE_EXECUTED = "TS$EXECUTED";
  static readonly STATE_REWORK   = "TS$REWORK";

  static readonly KANBAN_STATE_NEW = 'KB$NEW';
  static readonly KANBAN_STATE_IN_PROGRESS = 'KB$IN_PROGRESS';
  static readonly KANBAN_STATE_ON_HOLD = 'KB$ON_HOLD';
  static readonly KANBAN_STATE_COMPLETED = 'KB$COMPLETED';

  priority: string;
  number: string;
  description: string;
  comment: string;
  state: string;
  kanbanState: string;
  executionDatePlan: Date | null;
  executionDateFact: Date | null;
  creator: User | null;
  executor: User | null | undefined;
  initiator: User | null;
  daysUntilDueDate: number;
  started: boolean;
  overdue: boolean;
  project: Project | null | undefined;

  constructor() {
    super(ApplicationConstants.TASK);
    this.priority = '';
    this.number = '';
    this.description = '';
    this.comment = '';
    this.state = '';
    this.kanbanState = '';
    this.executionDatePlan = null;
    this.executionDateFact = null;
    this.creator = null;
    this.executor = null;
    this.initiator = null;
    this.daysUntilDueDate = 0;
    this.started = false;
    this.overdue = false;
    this.project = null;
  }
}
