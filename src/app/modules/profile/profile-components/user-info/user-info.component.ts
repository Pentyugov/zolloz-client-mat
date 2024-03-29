import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {ApplicationService} from "../../../../service/application.service";
import {User} from "../../../../model/user";
import {Position} from "../../../../model/position";
import {UserService} from "../../../../service/user.service";
import {Subscription} from "rxjs";
import {UploadClient} from "@uploadcare/upload-client";
import {environment} from "../../../../../environments/environment";
import {EventNotificationService} from "../../../../service/event-notification.service";
import {EventNotificationCaptionEnum} from "../../../../enum/event-notification-caption.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {UcWidgetComponent} from "ngx-uploadcare-widget";
import {UserSettings} from "../../../../model/user-settings";

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit, OnDestroy, AfterViewInit {
  public currentUser: User;
  public userInfo: UserInfo;
  private subscriptions: Subscription[] = [];
  private title: string = '';
  private message: string = '';
  @ViewChild(UcWidgetComponent) widget!: UcWidgetComponent;
  constructor(public translate: TranslateService,
              public applicationService: ApplicationService,
              private userService: UserService,
              private eventNotificationService: EventNotificationService) {
    this.currentUser = this.userService.getCurrentUser();


    this.subscriptions.push(
      this.userService.currentUser.subscribe(cu => {
        this.currentUser = cu;
        this.userInfo = new UserInfo(this.currentUser, null)
      }));

    this.userInfo = new UserInfo(this.currentUser, null);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  onUploadComplete($event: any) {
    const profileImageUrl = $event.cdnUrl;
    let formData = new FormData();
    formData.append('id', this.currentUser.id);
    formData.append('profileImageUrl', profileImageUrl);

    this.userService.updateUserProfileImage(formData).subscribe(
      (response: User) => {
        this.currentUser = response;
        this.userService.changeCurrentUser(this.currentUser);
        this.applicationService.changeRefreshing(false);
        this.translate.get(EventNotificationCaptionEnum.SUCCESS).subscribe(m => this.title = m);
        this.translate.get('ImageUpdatedSuccess').subscribe(m => this.message = m);
        this.eventNotificationService.showSuccessNotification(this.title, this.message);
      }, (errorResponse: HttpErrorResponse) => {
        this.applicationService.changeRefreshing(false);
        this.translate.get(EventNotificationCaptionEnum.ERROR).subscribe(m => this.title = m);
        this.eventNotificationService.showErrorNotification(EventNotificationCaptionEnum.ERROR,errorResponse.error.message);
      });

    this.widget.clearUploads();
  }

  public onProgress($event: any) {
    this.applicationService.changeRefreshing(true);
  }

  public openUploadFileDialog(): void {
    this.widget.openDialog();
  }

  public async onChangeImage($event: any) {
    console.log($event.files);
    $event.value;
    const files = $event.srcElement.files;
    if (files != null) {
      const image = files[0];
      if (image) {
        this.applicationService.changeRefreshing(true);
        let imageUrl = await this.uploadImage(image);
        let formData = new FormData();
        formData.append('id', this.currentUser.id);
        formData.append('profileImageUrl', imageUrl);

        this.userService.updateUserProfileImage(formData).subscribe(
          (response: User) => {
            this.currentUser = response;
            this.userService.changeCurrentUser(this.currentUser);
            this.applicationService.changeRefreshing(false);
            this.eventNotificationService.showSuccessNotification(this.title,
              'Your image was successfully updated');
          }, (errorResponse: HttpErrorResponse) => {
            this.applicationService.changeRefreshing(false);
            this.eventNotificationService.showErrorNotification(EventNotificationCaptionEnum.ERROR,errorResponse.error.message);
          });
      }
    }
  }

  public async uploadImage(image: File | null): Promise<string> {
    let url: string = '';
    if (image != null) {
      const client = new UploadClient({ publicKey: environment.uploadCarePublicKey })
      await client.uploadFile(image).then(file => {
        if (file.cdnUrl != null) {
          url = file.cdnUrl;
        }
        console.log(file.cdnUrl)
      });
    }
    return url;
  }


  public onChangePhotoBtnClick() {
    document.getElementById('fileInput')?.click();
  }


  public deleteProfileImage() {
    this.applicationService.changeRefreshing(true);
    this.userService.deleteProfileImage(this.currentUser.id).subscribe(
      (response: User) => {
        this.userService.changeCurrentUser(response);
        this.currentUser = this.userService.getCurrentUser();
        this.applicationService.changeRefreshing(false);

        this.eventNotificationService.showSuccessNotification(EventNotificationCaptionEnum.SUCCESS,
          'Your profile image was successfully deleted');
      }, (errorResponse: HttpErrorResponse) => {
      this.applicationService.changeRefreshing(false);
      this.eventNotificationService.showErrorNotification(EventNotificationCaptionEnum.ERROR,errorResponse.error.message);
    });
  }


}

export class UserInfo {
  fullName: string = ''
  profileImage: string = ''
  position: string = ''

  constructor(user: User, position: Position | null) {
    if (user.firstName) {
      this.fullName = user.firstName;
      if (user.lastName) {
        this.fullName += ' ' + user.lastName;
      }
    } else {
      this.fullName = user.username;
    }
    this.profileImage = user.profileImage;

    if (position) {
      this.position = position.name;
    }
  }

}
