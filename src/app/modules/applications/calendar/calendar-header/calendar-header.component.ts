import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {CalendarEditComponent} from "../calendar-edit/calendar-edit.component";

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss']
})
export class CalendarHeaderComponent {

  @Input() isDarkMode: any;
  @Output() onAdd: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public editor: MatDialog) {

  }

  public openAddDialog(): void {

    const editor = this.editor.open(CalendarEditComponent, {
      panelClass: this.isDarkMode ? 'dark' : 'calendar-form-dialog',
      data: {
        entity: null,
        isNewItem: true
      }
    });

    editor.afterClosed().subscribe(() => {
      this.onAdd.emit(true);
    });
  }

}
