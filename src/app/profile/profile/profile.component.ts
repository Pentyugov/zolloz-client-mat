import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../service/authentication.service";
import {User} from "../../model/user";
import {Employee} from "../../model/employee";
import {Position} from "../../model/position";
import {TranslateService} from "@ngx-translate/core";
import {UserService} from "../../service/user.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {

  }

}
