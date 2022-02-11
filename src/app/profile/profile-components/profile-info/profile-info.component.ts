import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../model/user";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../../service/user.service";

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit {
  @Input() public currentUser: User = new User();
  constructor(public dialog: MatDialog,
              public userService: UserService) {
    this.currentUser = this.userService.getCurrentUser();
  }

  ngOnInit(): void {
  }


  public onUpdateUser(): void {

  }

  public openDialog(): void {
    this.currentUser.username = 'test';
    this.userService.changeCurrentUser(this.currentUser);
    // const dialogRef = this.dialog.open(UpdateProfileDialogComponent, {
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //
    // });
  }
}

@Component({
  selector: 'app-update-profile-dialog',
  templateUrl: './update-profile-dialog.component.html',
  styleUrls: []
})
export class UpdateProfileDialogComponent implements OnInit {
  ngOnInit(): void {

  }

  onUpdateProfileInfo() {

  }

  closeDialog() {

  }
}
