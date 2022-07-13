export class TaskSignalProcRequest {
  taskId: string;
  action: string;
  comment: string;

  constructor() {
    this.taskId = '';
    this.action = '';
    this.comment = '';
  }
}
