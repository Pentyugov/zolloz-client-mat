import { Component, OnInit } from '@angular/core';
// const nisPackage = require("../../package.json");

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  ngOnInit(): void {
    console.log('test started');
  }

}
