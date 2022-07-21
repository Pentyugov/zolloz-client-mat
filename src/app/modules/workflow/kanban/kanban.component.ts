import {Component, Injector, OnInit} from '@angular/core';
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
}

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent extends NewAbstractBrowser<Task> implements OnInit {

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

  ngOnInit(): void {
    this.loadActiveTaskForExecutor();
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
        this.new.push(task);
      } else if (task.kanbanState === Task.KANBAN_STATE_IN_PROGRESS) {
        this.inProgress.push(task);
      } else if (task.kanbanState === Task.KANBAN_STATE_ON_HOLD) {
        this.onHold.push(task);
      } else if (task.kanbanState === Task.KANBAN_STATE_COMPLETED) {
        this.completed.push(task);
      }
    });
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
      let item: any = event.container.data[event.currentIndex];
      this.onChangeState(item.id, KanbanComponent.getState(event.container.id))
    }
  }

  private onChangeState(taskId: string, state: string): void {
    const request: ChangeKanbanRequest = {
      taskId: taskId,
      state: state
    }
    this.subscriptions.push(this.taskService.changeKanbanState(request).subscribe(() => {
    }));
  }

  private static getState(containerId: string): string {

    const containerNumber = Number(containerId.charAt(containerId.length -1));
    if (containerNumber === 0 || containerNumber % 4 === 0)
      return Task.KANBAN_STATE_NEW;
    if (containerNumber === 1 || containerNumber % 5 === 0)
      return Task.KANBAN_STATE_IN_PROGRESS;
    if (containerNumber === 2 || containerNumber % 6 === 0)
      return Task.KANBAN_STATE_ON_HOLD;
    if (containerNumber === 3 || containerNumber % 7 === 0)
      return Task.KANBAN_STATE_COMPLETED;

    return Task.KANBAN_STATE_NEW;

    // switch (containerId) {
    //   case 'cdk-drop-list-0' : return Task.KANBAN_STATE_NEW;
    //   case 'cdk-drop-list-1' : return Task.KANBAN_STATE_IN_PROGRESS;
    //   case 'cdk-drop-list-2' : return Task.KANBAN_STATE_ON_HOLD;
    //   case 'cdk-drop-list-3' : return Task.KANBAN_STATE_COMPLETED;
    //   default: return Task.KANBAN_STATE_NEW;
    // }
  }

}
