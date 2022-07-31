export class Notification {
  id : string;
  createDate: Date;
  title: string;
  message: string;
  type: number;
  accessoryType: number;
  read: boolean;
  cardId: string;

  constructor() {
    this.id = '';
    this.createDate = new Date();
    this.title = '';
    this.message = '';
    this.type = 0;
    this.accessoryType = 0;
    this.read = false;
    this.cardId = '';
  }

}
