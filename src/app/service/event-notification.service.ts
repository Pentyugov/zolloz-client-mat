import { Injectable } from '@angular/core';
import {NotificationsService} from "angular2-notifications";

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
