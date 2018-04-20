import { Component, OnInit } from '@angular/core';
import { IVMWorkOrderListItem } from '../../model/viewModel/workorderModels/vmWorkOrder';
import { WorkOrderService } from '../../core/services/workorders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PagerService } from '../../core/services/pager.service';
import { Global } from '../../core/services/global';
import { MessageType, MessageBoxComponent } from '../../shared/message-box/message-box.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { AppError } from '../../errorhandlers/app-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';

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
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  constructor(private workorderService: WorkOrderService,
    private activeRoute: ActivatedRoute,
    private route: Router,
    private pagerService: PagerService,
    private dialogService: DialogService) { }

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
          this.checkedItems = [];
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

  newWorkOrder() {
    this.route.navigate(['workorder/new']);
  }

  deleteWorkOrder(workorder: IVMWorkOrderListItem) {
    let disposable = this.dialogService.addDialog(MessageBoxComponent, {
      title: "Delete?",
      messageType: MessageType.Question,
      message: "Do you want to delete selected workorder?"

    }).subscribe((isConfirmed) => {
      if (isConfirmed) {
          this.workorderService.deleteWorkOrder(workorder.id)
            .subscribe(
              responseData => {
                if (responseData.Success) {
                  this.getWorkOrderList();
                  Global.setLoadingFlag(false);
                } else {
                  Global.setLoadingFlag(false);
                  this.showMessage(MessageType.Error, 'Error', responseData.Message);
                  return;
                }
              })
          this.setPage(1);
      }
    })
   }

  /* selectedItem(workorder, event) {
    if (event.target.checked) {
      this.checkedItems.push(workorder);
      //alert(machine.machineSrNo);
    }
  } */

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

  openWOTeam(id: number) {
    this.route.navigate(['workorderteam/' + id])
  }

  showMessage(messageType: MessageType, title: string, message: string) {

    let disposable = this.dialogService.addDialog(MessageBoxComponent, {
      title: title,
      messageType: messageType,
      message: message

    }).subscribe((isConfirmed) => { });
  }
}
