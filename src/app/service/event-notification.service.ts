import { Injectable } from '@angular/core';
import {NotificationsService} from "angular2-notifications";
import {NotificationType} from "../enum/notification-type.enum";

@Injectable({
  providedIn: 'root'
})
export class EventNotificationService {

  private notificationOptions = {
    timeOut: 3000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true
  }

  constructor(private _service: NotificationsService) {

  }

  public showNotification(type: NotificationType, caption: string, description: string): void {
    switch (type) {
      case NotificationType.INFO:
        this.showInfoNotification(caption, description);
        break;
      case NotificationType.SUCCESS:
        this.showSuccessNotification(caption, description);
        break;
      case NotificationType.WARNING:
        this.showWarnNotification(caption, description);
        break;
      case NotificationType.ERROR:
        this.showErrorNotification(caption, description);
        break;
      case NotificationType.DEFAULT:
        this.showAlertNotification(caption, description);
        break;
    }
  }

  public showInfoNotification(caption: string, description: string): void {
      this._service.info(caption, description, this.notificationOptions)
  }

  public showSuccessNotification(caption: string, description: string): void {
    this._service.success(caption, description, this.notificationOptions)
  }

  public showErrorNotification(caption: string, description: string): void {
    this._service.error(caption, description, this.notificationOptions)
  }

  public showWarnNotification(caption: string, description: string): void {
    this._service.warn(caption, description, this.notificationOptions)
  }

  public showAlertNotification(caption: string, description: string): void {
    this._service.alert(caption, description, this.notificationOptions)
  }


}
