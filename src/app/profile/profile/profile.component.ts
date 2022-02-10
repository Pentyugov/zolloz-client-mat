import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {User} from "../../model/user";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public currentUser: User = new User;
  constructor(private authenticationService: AuthenticationService) {
    this.currentUser = this.authenticationService.getUserFromLocalCache();
  }

  ngOnInit(): void {

  }

}
