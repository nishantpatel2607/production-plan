import { Component, OnInit } from '@angular/core';

interface woPlan {
  planDate: string;
  id:number;
  workOrderNo: string;
}

@Component({
  selector: 'app-wo-planner',
  templateUrl: './wo-planner.component.html',
  styleUrls: ['./wo-planner.component.css']
})
export class WoPlannerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
