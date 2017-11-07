
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Route } from '@angular/router';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private route: ActivatedRoute) { 
    
  }

  ngOnInit() {
  }

}
