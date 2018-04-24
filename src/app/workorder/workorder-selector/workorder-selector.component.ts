import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IVMWorkOrderListItem } from '../../model/viewModel/workorderModels/vmWorkOrder';
import { WorkOrderService } from '../../core/services/workorders.service';
import { PagerService } from '../../core/services/pager.service';
import { IVMWorkOrderPlan } from '../../model/viewModel/workorderModels/vmWorkOrderPlan';
import { Global } from '../../core/services/global';
import { MessageType, MessageBoxComponent } from '../../shared/message-box/message-box.component';
import { AppError } from '../../errorhandlers/app-error';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';
import { DialogService } from 'ng2-bootstrap-modal';

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
  currentDate: Date;

  NoDateError = true;
  NoStartTimeError = true;
  NoEndTimeError = true;
  NoWorkOrderSelectedError = true;

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
    this.NoDateError = true;
    this.NoStartTimeError = true;
    this.NoEndTimeError = true;
    this.NoWorkOrderSelectedError = true;

  }


  constructor(private workorderService: WorkOrderService,
    private pagerService: PagerService,
    private dialogService: DialogService) {
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
    this.currentDate = new Date();
  }


  ngOnInit() {
    this.getWorkOrderList();
  }

  getWorkOrderList() {
    Global.setLoadingFlag(true);
    this.workorderService.getWorkOrderList()
      .subscribe(woData => {
        if (woData.Success) {
          this.workOrders = woData.data;
          this.filteredItems = this.workOrders;
          this.setPage(1);
          Global.setLoadingFlag(false);
        } else {
          Global.setLoadingFlag(false);
          this.showMessage(MessageType.Error, "Error", woData.Message);
        }
      },
        (error: AppError) => {
          Global.setLoadingFlag(false);
          if (error instanceof NotFoundError) {
            this.showMessage(MessageType.Error, "Error", "Requested data not found.");
          }
          else if (error instanceof BadRequestError) {
            this.showMessage(MessageType.Error, "Error", "Unable to process the request.");
          }
          else throw error;
        });
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

  setSelectedRow(i, workorder: IVMWorkOrderListItem) {
    //console.log(i);
    this.selectedRow = i;
    this.selectedWorkOrder.id = 0;
    this.selectedWorkOrder.workOrderId = workorder.id;
    this.selectedWorkOrder.workOrderNo = workorder.workOrderNo;
    this.selectedWorkOrder.assemblyName = workorder.assemblyName;
    this.selectedWorkOrder.machineName = workorder.machineName;
    this.selectedWorkOrder.qty = workorder.qty;
    this.NoWorkOrderSelectedError = true;
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

  planDateChange() {
    this.NoDateError = true;
  }

  plannedStartTimeChanged() {
    this.NoStartTimeError = true;
  }

  plannedEndTimeChanged() {
    this.NoEndTimeError = true;
  }

  okForm() {
    let bValid = true;
    if (this.selectedWorkOrder.workOrderId == 0) {
      bValid = false;
      this.NoWorkOrderSelectedError = false;
    }

    //console.log(this.selectedWorkOrder.plannedStartDate);
    if (this.selectedWorkOrder.plannedStartDate == "" || this.selectedWorkOrder.plannedStartDate == null) {
      bValid = false;
      this.NoDateError = false;
      //console.log(this.NoDateError);
    }

    if (this.selectedWorkOrder.plannedStartTime == "" || this.selectedWorkOrder.plannedStartTime == null) {
      bValid = false;
      this.NoStartTimeError = false;
    }

    if (this.selectedWorkOrder.plannedEndTime == "" || this.selectedWorkOrder.plannedEndTime == null) {
      bValid = false;
      this.NoEndTimeError = false;
    }

    if (Date.parse('01/01/2011 ' + this.selectedWorkOrder.plannedStartTime) >
      Date.parse('01/01/2011 ' + this.selectedWorkOrder.plannedEndTime)) {
      bValid = false;
    }

    if (bValid) {
      let dt: string[] = this.selectedWorkOrder.plannedStartDate.split('/');
      dt = dt.reverse();
      let str = dt.join("-");
      let selectedWorkOrderTemp: IVMWorkOrderPlan = {
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

  showMessage(messageType: MessageType, title: string, message: string) {

    let disposable = this.dialogService.addDialog(MessageBoxComponent, {
      title: title,
      messageType: messageType,
      message: message

    }).subscribe((isConfirmed) => { });
  }


}
