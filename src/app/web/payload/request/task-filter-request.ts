import {TaskFilter} from "../../../utils/filters/task-filter";

export class TaskFilterRequest {
  ids: string[] = [];
  taskFilters: TaskFilter[] = [];
}
