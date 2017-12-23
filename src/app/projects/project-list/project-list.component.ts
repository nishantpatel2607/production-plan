import { OrderService } from '../../core/services/order.service';
import { Component, OnInit } from '@angular/core';
import { IOrder } from '../../model/orderMaster';
import { ActivatedRoute, Router } from '@angular/router';
import { PagerService } from '../../core/services/pager.service';

@Component({
  selector: 'project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  pageTitle: string = "Projects";
  orders: IOrder[];
  errorMessage: string;
  listFilter: string = "";
  orderStatus: number;
  pager: any = {};
  pagedItems: IOrder[];
  filteredItems: IOrder[];

  constructor(private activeRoute: ActivatedRoute,
    private route: Router,
     private orderService: OrderService,
     private pagerService: PagerService) { }

     //sorting
  key: string = 'firstName'; //set default
  reverse: boolean = false;
  sort(key){
    this.key = key;
    this.reverse = !this.reverse; 
  }
  
  ngOnInit() {
    this.orderService.getOrders(this.orderStatus)
    .subscribe(ordersData => {
      this.orders = ordersData;
      
    }, 
    error => this.errorMessage = <any>error,
    ()=>{
      this.filteredItems = this.orders;
      this.setPage(1);})
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.filteredItems.length, page);

    // get current page of items
    this.pagedItems = this.filteredItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    
  }

  filterRecords(){}

}
