import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IVMWorkOrderListItem } from '../../model/viewModel/workorderModels/vmWorkOrder';
import { WorkOrderService } from '../../core/services/workorders.service';
import { PagerService } from '../../core/services/pager.service';
import { IVMWorkOrderPlan } from '../../model/viewModel/workorderModels/vmWorkOrderPlan';

@Component({
  selector: 'workorder-selector',
  templateUrl: './workorder-selector.component.html',
  styleUrls: ['./workorder-selector.component.css']
})
export class WorkorderSelectorComponent implements OnInit {

  @Output('onSelect') onSelect = new EventEmitter();
  @Output('onCancel') onCancel = new EventEmitter();

  @Input('InitializeObject') initializeObject: boolean = false;

  selectedRow: number;
  workOrders: IVMWorkOrderListItem[];
  errorMessage: string;
  listFilter: string = "";

  pager: any = {};
  pagedItems: IVMWorkOrderListItem[];
  filteredItems: IVMWorkOrderListItem[];

  selectedWorkOrder: IVMWorkOrderPlan;

  plannedDate = "";
  timeFrom = "";
  timeTo = "";

  //sorting
  key: string = 'workOrderNo'; //set default
  reverse: boolean = false;
  sort(key) {
    this.selectedRow = 0;
    this.key = key;
    this.reverse = !this.reverse;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.selectedWorkOrder = {
      id: 0,
      workOrderId: 0,
      workOrderNo: "",
      machineName: "",
      assemblyName: "",
      qty: 0,
      plannedStartDate: "",
      plannedEndDate: "",
      plannedStartTime: "",
      plannedEndTime: "",
      actualStartDate: "",
      actualEndDate: "",
      actualStartTime: "",
      actualEndTime: ""
    }
    this.selectedRow = -1;
   
  }
  

  constructor(private workorderService: WorkOrderService,
    private pagerService: PagerService) {
      //console.log('constructor');
    this.selectedWorkOrder = {
      id: 0,
      workOrderId: 0,
      workOrderNo: "",
      machineName: "",
      assemblyName: "",
      qty: 0,
      plannedStartDate: "",
      plannedEndDate: "",
      plannedStartTime: "",
      plannedEndTime: "",
      actualStartDate: "",
      actualEndDate: "",
      actualStartTime: "",
      actualEndTime: ""
    }
  }


  ngOnInit() {
    this.getWorkOrderList();
  }

  getWorkOrderList(){
    
   
    this.workorderService.getWorkOrderList()
      .subscribe(woData => {
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

  setSelectedRow(i,workorder:IVMWorkOrderListItem) {
    //console.log(i);
    this.selectedRow = i;
    this.selectedWorkOrder.id = 0;
    this.selectedWorkOrder.workOrderId = workorder.id;
    this.selectedWorkOrder.workOrderNo = workorder.workOrderNo;
    this.selectedWorkOrder.assemblyName = workorder.assemblyName;
    this.selectedWorkOrder.machineName = workorder.machineName;
    this.selectedWorkOrder.qty = workorder.qty;
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

  cancelForm() { this.onCancel.emit(); }

  okForm() {
    //console.log("Dt" + this.selectedWorkOrder.plannedStartDate);
    let dt: string[] = this.selectedWorkOrder.plannedStartDate.split('/');
    //console.log(dt);
    dt = dt.reverse();
    let str = dt.join("-");
    //console.log(str);

    let selectedWorkOrderTemp : IVMWorkOrderPlan = {
      id: 0,
      workOrderId: this.selectedWorkOrder.workOrderId,
      workOrderNo: this.selectedWorkOrder.workOrderNo,
      machineName: this.selectedWorkOrder.machineName,
      assemblyName: this.selectedWorkOrder.assemblyName,
      qty: this.selectedWorkOrder.qty,
      plannedStartDate: str,
      plannedEndDate: str,
      plannedStartTime: this.selectedWorkOrder.plannedStartTime,
      plannedEndTime: this.selectedWorkOrder.plannedEndTime,
      actualStartDate: "",
      actualEndDate: "",
      actualStartTime: "",
      actualEndTime: ""
    }

    this.onSelect.emit(selectedWorkOrderTemp);
  }


}
