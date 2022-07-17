import {Entity} from "./entity";
import {ApplicationConstants} from "../modules/shared/application-constants";
import {User} from "./user";

export class Note extends Entity {
  date: Date;
  category: string;
  title: string;
  description: string;
  color: string;
  user: User | null;

  constructor() {
    super(ApplicationConstants.NOTE);
    this.date = new Date();
    this.title = '';
    this.category = '';
    this.description = '';
    this.color = 'info';
    this.user = null;
  }

}
