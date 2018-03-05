import { Component, OnInit } from '@angular/core';
import { IVMWorkOrderListItem } from '../../model/viewModel/workorderModels/vmWorkOrder';
import { WorkOrderService } from '../../core/services/workorders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PagerService } from '../../core/services/pager.service';

@Component({
  selector: 'app-workorder-list',
  templateUrl: './workorder-list.component.html',
  styleUrls: ['./workorder-list.component.css']
})
export class WorkorderListComponent implements OnInit {

  workOrders: IVMWorkOrderListItem[];
  errorMessage: string;
  listFilter: string = "";

  pager: any = {};
  pagedItems: IVMWorkOrderListItem[];
  filteredItems: IVMWorkOrderListItem[];
  checkedItems: IVMWorkOrderListItem[];

  //sorting
  key: string = 'workOrderNo'; //set default
  reverse: boolean = false;
  sort(key){
    this.key = key;
    this.reverse = !this.reverse; 
  }

  constructor(private workorderService: WorkOrderService,
    private activeRoute: ActivatedRoute,
    private route: Router,
    private pagerService: PagerService) { }

  ngOnInit() {
    this.workorderService.getWorkOrderList()
    .subscribe(woData =>{
      this.workOrders = woData;
      this.filteredItems = this.workOrders;
      this.checkedItems = [];
        this.setPage(1);
    },
    error => this.errorMessage = <any>error);
  }

  newWorkOrder() {
    this.route.navigate(['workorder/new']);
  }

  deleteWorkOrder() {}

  selectedItem(workorder, event) {
    if (event.target.checked) {
      this.checkedItems.push(workorder);
      //alert(machine.machineSrNo);
    }
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.filteredItems.length, page);

    // get current page of items
    this.pagedItems = this.filteredItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.checkedItems = [];
  }

  filterRecords(value) {
    this.listFilter = value;
    var valueToSearch = this.listFilter.toUpperCase().trim();
    this.filteredItems = [];
    if (this.listFilter != "") {
      this.workOrders.forEach(assembly => {
        if (assembly.assemblyName.toUpperCase().indexOf(valueToSearch) >= 0
          
         ) {
          this.filteredItems.push(assembly);
        }
      });
    } else {
      this.filteredItems = this.workOrders;
    }
    //console.log(this.filteredItems);
    this.setPage(1);
  }

  openWOTeam(id:number){
    this.route.navigate(['workorderteam/'+id]) 
  }

}
