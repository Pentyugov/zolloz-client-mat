import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {NewAbstractBrowser} from "../../shared/browser/new-abstract.browser";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../../service/event-notification.service";
import {ApplicationService} from "../../../service/application.service";
import {MatDialog} from "@angular/material/dialog";
import {ScreenService} from "../../../service/screen.service";
import {TaskService} from "../../../service/task.service";
import {TaskEditComponent} from "../task/tast-edit/task-edit.component";
import {Task} from "../../../model/task";
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {HttpErrorResponse} from "@angular/common/http";
import {ApplicationConstants} from "../../shared/application-constants";

export interface ChangeKanbanRequest {
  taskId: string;
  state: string;
  order: number;
}

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent extends NewAbstractBrowser<Task> implements OnInit, OnDestroy {

  public new: Task [] = [];
  public inProgress: Task [] = [];
  public onHold: Task [] = [];
  public completed: Task [] = [];

  constructor(injector: Injector,
              router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              dialog: MatDialog,
              editor: MatDialog,
              screenService: ScreenService,
              private taskService: TaskService,) {
    super(injector,
      router,
      translate,
      eventNotificationService,
      applicationService,
      dialog,
      TaskEditComponent,
      taskService,
      editor,
      screenService);
    this.id = 'screen$Kanban';

  }

  public reloadPage(): void {

  }

  ngOnInit(): void {
    if (!localStorage.getItem('reloadKanbanPage')) {
      localStorage.setItem('reloadKanbanPage', 'no-reload');
      location.reload();
    } else {
      localStorage.removeItem('reloadKanbanPage');
      this.loadActiveTaskForExecutor();
    }

  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private loadActiveTaskForExecutor(): void {
    this.subscriptions.push(
      this.taskService.getActiveForExecutor().subscribe(
        (response: Task[]) => {
          this.entities = response;
          this.afterLoadEntities();
        }, (errorResponse: HttpErrorResponse) => {
          this.eventNotificationService.showErrorNotification('Error', errorResponse.error.message)
        }
      )
    );
  }

  public override afterLoadEntities() {
    super.afterLoadEntities();
    this.filterEntities();
  }

  public override openDialog(action: string, entity: Task | null): void {
    if (this.editorComponent) {
      let isNewItem = false;
      if (action === ApplicationConstants.DIALOG_ACTION_ADD) {
        isNewItem = true;
      }
      const editor = this.editor.open(this.editorComponent, {
        width: "100%",
        height: "800px",
        panelClass: this.isDarkMode ? 'dark' : '',
        data: {
          entity: entity,
          isNewItem: isNewItem
        }
      });

      editor.afterClosed().subscribe(() => {
        this.new = [];
        this.inProgress = [];
        this.onHold = [];
        this.completed = [];
        this.loadActiveTaskForExecutor();
      });
    }

  }

  private filterEntities(): void {
    this.entities.forEach(entity => {
      const task = entity as Task;
      if (task.kanbanState === Task.KANBAN_STATE_NEW) {
        KanbanComponent.filterContainer(this.new, task);
      } else if (task.kanbanState === Task.KANBAN_STATE_IN_PROGRESS) {
        KanbanComponent.filterContainer(this.inProgress, task);
      } else if (task.kanbanState === Task.KANBAN_STATE_ON_HOLD) {
        KanbanComponent.filterContainer(this.onHold, task);
      } else if (task.kanbanState === Task.KANBAN_STATE_COMPLETED) {
        KanbanComponent.filterContainer(this.completed, task);
      }
    });
  }

  private static filterContainer(container: Task[], task: Task): void {
    let orderIndex = task.kanbanOrder;
    while (container[orderIndex]) {
      orderIndex++;
    }
    task.kanbanOrder = orderIndex;
    container[orderIndex] = task;
  }

  public drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    this.onChangeState();
  }

  private onChangeState(): void {
    const requests: ChangeKanbanRequest[] = [];

    this.new.forEach(task => {
      const request: ChangeKanbanRequest = {
        taskId: task.id,
        state: Task.KANBAN_STATE_NEW,
        order: this.new.indexOf(task)
      }
      requests.push(request);
    });

    this.inProgress.forEach(task => {
      const request: ChangeKanbanRequest = {
        taskId: task.id,
        state: Task.KANBAN_STATE_IN_PROGRESS,
        order: this.inProgress.indexOf(task)
      }
      requests.push(request);
    });

    this.onHold.forEach(task => {
      const request: ChangeKanbanRequest = {
        taskId: task.id,
        state: Task.KANBAN_STATE_ON_HOLD,
        order: this.onHold.indexOf(task)
      }
      requests.push(request);
    });

    this.completed.forEach(task => {
      const request: ChangeKanbanRequest = {
        taskId: task.id,
        state: Task.KANBAN_STATE_COMPLETED,
        order: this.completed.indexOf(task)
      }
      requests.push(request);
    });

    this.subscriptions.push(this.taskService.changeKanbanState(requests).subscribe(() => {
    }));
  }

}
