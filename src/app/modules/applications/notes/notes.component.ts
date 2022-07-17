import {Component, Injector, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {EventNotificationService} from "../../../service/event-notification.service";
import {ApplicationService} from "../../../service/application.service";
import {ScreenService} from "../../../service/screen.service";
import {MatDialog} from "@angular/material/dialog";
import {Note} from "../../../model/note";
import {NewAbstractBrowser} from "../../shared/browser/new-abstract.browser";
import {NoteService} from "../../../service/note.service";
import {UserService} from "../../../service/user.service";
import {CustomHttpResponse} from "../../../model/custom-http-response";
import {Utils} from "../../../utils/utils";
import {ApplicationConstants} from "../../shared/application-constants";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
})
export class NotesComponent extends NewAbstractBrowser<Note> implements OnInit {
  sidePanelOpened = true;
  changed=false;

  public notes: Note[] = [];
  selectedNote: Note = Object.create(null);
  searchText = '';
  clrName = 'warning';
  colors = Utils.BASIC_COLORS;
  constructor(injector: Injector,
              router: Router,
              translate: TranslateService,
              eventNotificationService: EventNotificationService,
              applicationService: ApplicationService,
              dialog: MatDialog,
              editor: MatDialog,
              screenService: ScreenService,
              private userService: UserService,
              private noteService: NoteService) {
    super(injector,
      router,
      translate,
      eventNotificationService,
      applicationService,
      dialog,
      null,
      noteService,
      editor,
      screenService);

  }

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  ngOnInit(): void {
    this.loadEntities();
  }

  public override onClickRow(row: any) {
    super.onClickRow(row);
    this.clrName = this.clickedRow.color;
  }

  onSelectColor(colorName: string): void {
    this.clrName = colorName;
    this.clickedRow.color = this.clrName;
    this.updateNote();
  }

  deleteNote(note: Note): void {
    this.onDeleteEntity(note)
  }

  public override onDeleteEntity(entity: Note) {
    this.applicationService.changeRefreshing(true);
    this.subscriptions.push(
      this.entityService.delete(entity.id).subscribe(
        () => {
          this.loadEntities();
          this.applicationService.changeRefreshing(false);
        }, (errorResponse: HttpErrorResponse) => {
          this.subscriptions.push(this.translate.get(ApplicationConstants.NOTIFICATION_TITLE_ERROR).subscribe(m => {
            this.messageTitle = m;
          }));
          this.loadEntities();
          this.applicationService.changeRefreshing(false);
          this.eventNotificationService.showErrorNotification(this.messageTitle, errorResponse.error.message);
        }
      )
    );
  }

  public updateNote(): void {
    this.onUpdateNote(this.clickedRow);
  }

  public addNote(): void {
    this.getMessage('Notes.NewNoteTitle').then(title => {
      const note = new Note();
      note.title = title;
      note.user = this.userService.getCurrentUser();
      this.onAddNote(note);
    });

  }

  private onAddNote(note: Note): void {
    this.subscriptions.push(this.noteService.addNewNote(note).subscribe((response: CustomHttpResponse) => {
      if (response.httpStatusCode === 201) {
        this.loadEntities();
      }
    }));
  }

  private onUpdateNote(note: Note): void {
    this.subscriptions.push(this.noteService.updateNote(note).subscribe((response: CustomHttpResponse) => {
      if (response.httpStatusCode === 200) {
        this.loadEntities();
        this.changed = false;
      }
    }));
  }

  public override afterLoadEntities() {
    this.clickedRow = null;
    if (this.entities.length > 0) {
      this.clickedRow = this.entities[0] as Note;
    }
  }
}
