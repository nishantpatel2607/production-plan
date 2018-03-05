import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import { IVMWorkOrderListItem } from '../../model/viewModel/workorderModels/vmWorkOrder';
import { WorkOrderService } from '../../core/services/workorders.service';
import { PagerService } from '../../core/services/pager.service';

@Component({
  selector: 'workorder-selector',
  templateUrl: './workorder-selector.component.html',
  styleUrls: ['./workorder-selector.component.css']
})
export class WorkorderSelectorComponent implements OnInit {

  @Output('onSelect') onSelect = new EventEmitter();
  @Output('onCancel') onCancel = new EventEmitter();

  selectedRow: number;
  workOrders: IVMWorkOrderListItem[];
  errorMessage: string;
  listFilter: string = "";

  pager: any = {};
  pagedItems: IVMWorkOrderListItem[];
  filteredItems: IVMWorkOrderListItem[];

  plannedDate="";
  timeFrom="";
  timeTo="";

  //sorting
  key: string = 'workOrderNo'; //set default
  reverse: boolean = false;
  sort(key){
    this.selectedRow=0;
    this.key = key;
    this.reverse = !this.reverse; 
  }


  constructor(private workorderService: WorkOrderService,
    private pagerService: PagerService) { }


  ngOnInit() {
    this.workorderService.getWorkOrderList()
    .subscribe(woData =>{
      this.workOrders = woData;
      this.filteredItems = this.workOrders;
        this.setPage(1);
    },
    error => this.errorMessage = <any>error);
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

  setSelectedRow(i) {
    //console.log(i);
    this.selectedRow = i;
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

  cancelForm(){this.onSelect.emit();}

  okForm(){
    this.onSelect.emit();
  }


}
