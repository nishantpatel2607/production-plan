import { Component, OnInit } from '@angular/core';
import { WorkOrderService } from '../../core/services/workorders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IVMWorkOrder } from '../../model/viewModel/workorderModels/vmWorkOrder';
import { IVMMachineListItem } from '../../model/viewModel/machineViewModels/vmMachine';
import { IVMAssemblyListItem } from '../../model/viewModel/assemblyViewModels/vmAssembly';
import { IVMWorkOrderSuitableEmployee } from '../../model/viewModel/workorderModels/vmWorkOrderSuitableEmployee';
import { PagerService } from '../../core/services/pager.service';
import { IVMWorkOrderTeam } from '../../model/viewModel/workorderModels/vmWorkOrderTeam';
import { Global } from '../../core/services/global';
import { AppError } from '../../errorhandlers/app-error';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { MessageType, MessageBoxComponent } from '../../shared/message-box/message-box.component';
import { BadRequestError } from '../../errorhandlers/bad-request-error';
import { DialogService } from 'ng2-bootstrap-modal';

@Component({
  selector: 'app-workorder-team',
  templateUrl: './workorder-team.component.html',
  styleUrls: ['./workorder-team.component.css']
})
export class WorkorderTeamComponent implements OnInit {
  workOrder: IVMWorkOrder;
  errorMessage;

  suitableEmployees: IVMWorkOrderSuitableEmployee[];
  listFilter_suitableEmployees: string = "";
  pager_suitableEmployees: any = {};
  pagedItems_suitableEmployees: IVMWorkOrderSuitableEmployee[];
  filteredItems_suitableEmployees: IVMWorkOrderSuitableEmployee[];


  teamMembers: IVMWorkOrderTeam[];
  listFilter_teamMembers: string = "";
  pager_teamMembers: any = {};
  pagedItems_teamMembers: IVMWorkOrderTeam[];
  filteredItems_teamMembers: IVMWorkOrderTeam[];

  constructor(private workOrderService: WorkOrderService,
    private activateRoute: ActivatedRoute,
    private pagerService: PagerService,
    private router: Router,
    private dialogService: DialogService) { }

  ngOnInit() {
    let machineItem: IVMMachineListItem = { 'id': 0, 'machineName': '' };
    let assemblyItem: IVMAssemblyListItem = { 'id': 0, 'assemblyName': '' };
    this.workOrder = {
      id: 0,
      workOrderNo: '',
      workOrderDate: '',
      machine: machineItem,
      assembly: assemblyItem,
      qty: 0
    }
    this.suitableEmployees = [];
    this.teamMembers = [];

    this.activateRoute.params.subscribe(
      params => {
        let id = +params['id'];
        if (Number.isNaN(id) == false) {
          this.getWorkOrder(id);
          this.getSuitableEmployees(id);
          this.getWorkOrderTeam(id);
        }
      });
  }

  getWorkOrder(id: number) {
    Global.setLoadingFlag(true);
    this.workOrderService.getWorkOrder(id).subscribe(
      wo => {
        if (wo.Success) {
          this.workOrder = wo.data[0];
          Global.setLoadingFlag(false);
        } else {
          Global.setLoadingFlag(false);
          this.showMessage(MessageType.Error, "Error", wo.Message);
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

  getSuitableEmployees(id: number) {
    Global.setLoadingFlag(true);
    this.workOrderService.getSuitableEmployees(id).subscribe(
      emp => {
        if (emp.Success) {
         
          this.suitableEmployees = emp.data;
          this.filteredItems_suitableEmployees = emp.data;
          this.setPage_suitableEmployees(1);
          Global.setLoadingFlag(false);
        } else {
          Global.setLoadingFlag(false);
          this.showMessage(MessageType.Error, "Error", emp.Message);
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

  getWorkOrderTeam(id: number) {
    Global.setLoadingFlag(true);
    this.workOrderService.getTeamMembers(id).subscribe(
      emp => {
        if (emp.Success) {
          this.teamMembers = emp.data;
          this.filteredItems_teamMembers = emp.data;
          this.setPage_teamMembers(1);
          Global.setLoadingFlag(false);
        } else {
          Global.setLoadingFlag(false);
          this.showMessage(MessageType.Error, "Error", emp.Message);
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

  setPage_suitableEmployees(page: number) {
    if (this.filteredItems_suitableEmployees.length > 0 && this.pager_suitableEmployees.totalPages == 0) { this.pager_suitableEmployees.totalPages = 1; }

    if (page < 1 || page > this.pager_suitableEmployees.totalPages) {
      return;
    }

    // get pager object from service
    this.pager_suitableEmployees = this.pagerService.getPager(this.filteredItems_suitableEmployees.length, page);

    // get current page of items
    this.pagedItems_suitableEmployees = this.filteredItems_suitableEmployees.slice(this.pager_suitableEmployees.startIndex, this.pager_suitableEmployees.endIndex + 1);
  }

  filterRecords_suitableEmployees(value) {
    this.listFilter_suitableEmployees = value;
    var valueToSearch = this.listFilter_suitableEmployees.toUpperCase().trim();
    this.filteredItems_suitableEmployees = [];
    if (this.listFilter_suitableEmployees != "") {
      this.suitableEmployees.forEach(emp => {
        if (emp.firstName.toUpperCase().indexOf(valueToSearch) >= 0
          || emp.lastName.toUpperCase().indexOf(valueToSearch) >= 0
          || emp.designation.toUpperCase().indexOf(valueToSearch) >= 0
        ) {
          this.filteredItems_suitableEmployees.push(emp);
        }
      });
    } else {
      this.filteredItems_suitableEmployees = this.suitableEmployees;
    }
    //console.log(this.filteredItems);
    this.setPage_suitableEmployees(1);
  }

  addEmpToTeam(emp: IVMWorkOrderSuitableEmployee) {
    console.log(emp);
    let teamMember: IVMWorkOrderTeam = {
      workOrderId: this.workOrder.id,
      employeeId: emp.id,
      firstName: emp.firstName,
      lastName: emp.lastName,
      designation: emp.designation
    }
    this.teamMembers.push(teamMember);
    this.filteredItems_teamMembers = this.teamMembers;
    this.setPage_teamMembers(1);

    let empPos: number = 0;
    empPos = this.suitableEmployees.findIndex(e => e.id == emp.id);
    this.suitableEmployees.splice(empPos, 1);
    this.filteredItems_suitableEmployees = this.suitableEmployees;
    this.setPage_suitableEmployees(1);

    //console.log(this.filteredItems_teamMembers);

  }

  removeEmpFromTeam(emp: IVMWorkOrderTeam) {

    let employee: IVMWorkOrderSuitableEmployee = {

      id: emp.employeeId,
      firstName: emp.firstName,
      lastName: emp.lastName,
      designation: emp.designation
    }


    this.suitableEmployees.push(employee);
    this.filteredItems_suitableEmployees = this.suitableEmployees;
    this.setPage_suitableEmployees(1);

    let empPos: number = 0;
    empPos = this.teamMembers.findIndex(e => e.employeeId == emp.employeeId);
    this.teamMembers.splice(empPos, 1);
    this.filteredItems_teamMembers = this.teamMembers;
    this.setPage_teamMembers(1);
  }

  setPage_teamMembers(page: number) {
    if (this.filteredItems_teamMembers.length > 0 && this.pager_teamMembers.totalPages == 0) { this.pager_teamMembers.totalPages = 1; }
    if (page < 1 || page > this.pager_teamMembers.totalPages) {
      return;
    }

    // get pager object from service
    this.pager_teamMembers = this.pagerService.getPager(this.filteredItems_teamMembers.length, page);

    // get current page of items
    this.pagedItems_teamMembers = this.filteredItems_teamMembers.slice(this.pager_teamMembers.startIndex, this.pager_teamMembers.endIndex + 1);
  }

  filterRecords_teamMembers(value) {
    this.listFilter_teamMembers = value;
    var valueToSearch = this.listFilter_teamMembers.toUpperCase().trim();
    this.filteredItems_teamMembers = [];
    if (this.listFilter_teamMembers != "") {
      this.teamMembers.forEach(emp => {
        if (emp.firstName.toUpperCase().indexOf(valueToSearch) >= 0
          || emp.lastName.toUpperCase().indexOf(valueToSearch) >= 0
          || emp.designation.toUpperCase().indexOf(valueToSearch) >= 0
        ) {
          this.filteredItems_teamMembers.push(emp);
        }
      });
    } else {
      this.filteredItems_teamMembers = this.teamMembers;
    }
    //console.log(this.filteredItems);
    this.setPage_teamMembers(1);
  }

  saveForm() {
    Global.setLoadingFlag(true);
    console.log(this.teamMembers); 
    this.workOrderService.saveTeamMembers(this.teamMembers) .subscribe(revData => {
      if (revData.Success){
        
        Global.setLoadingFlag(false);
      } else {
        Global.setLoadingFlag(false);
        this.showMessage(MessageType.Error, "Error", revData.Message);
      }
    }),
    (error: AppError) => {
      Global.setLoadingFlag(false);
      if (error instanceof NotFoundError) {
        this.showMessage(MessageType.Error, "Error", "Requested data not found.");
      }
      else if (error instanceof BadRequestError) {
        this.showMessage(MessageType.Error, "Error", "Unable to process the request.");
      }
      else throw error;
    } 
  }

  cancelForm() {
    this.router.navigate(['/workorderlist']);
  }


  showMessage(messageType: MessageType, title: string, message: string) {

    let disposable = this.dialogService.addDialog(MessageBoxComponent, {
      title: title,
      messageType: messageType,
      message: message

    }).subscribe((isConfirmed) => { });
  }

}
