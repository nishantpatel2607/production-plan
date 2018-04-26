import { Component, OnInit } from '@angular/core';
import { IVMWorkOrder } from '../../model/viewModel/workorderModels/vmWorkOrder';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from "moment"
import { IVMMachineListItem } from '../../model/viewModel/machineViewModels/vmMachine';
import { IVMAssemblyListItem } from '../../model/viewModel/assemblyViewModels/vmAssembly';
import { AssemblyService } from '../../core/services/assembly.service';
import { MachineService } from '../../core/services/machine.service';
import { IEmployee } from '../../model/employee';
import { EmployeeService } from '../../core/services/employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkOrderService } from '../../core/services/workorders.service';
import { Global } from '../../core/services/global';
import { AppError } from '../../errorhandlers/app-error';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';
import { MessageType, MessageBoxComponent } from '../../shared/message-box/message-box.component';
import { DialogService } from 'ng2-bootstrap-modal';

import { toastMessage } from '../../model/toastMessage';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-workorder-form',
  templateUrl: './workorder-form.component.html',
  styleUrls: ['./workorder-form.component.css']
})
export class WorkorderFormComponent implements OnInit {
  workOrder: IVMWorkOrder;
  form: FormGroup;
  buildMachine = false;
  defualtDate: Date;
  machineList: IVMMachineListItem[];
  assemblyList: IVMAssemblyListItem[];
  employeesList: IEmployee[];

  errorMessage;

  constructor(fb: FormBuilder,
    private assemblyService: AssemblyService,
    private machineService: MachineService,
    private activateRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private workOrderService: WorkOrderService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private router: Router) {
    this.form = fb.group({
      workOrderNo: ['', Validators.required],
      workOrderDate: ['', Validators.required],
      buildMachine: [],
      machine: [''],
      assembly: [''],
      qty: ['', Validators.required]
    });
  }

  ngOnInit() {
    let machineItem: IVMMachineListItem = { 'id': 0, 'machineName': '' };
    let assemblyItem: IVMAssemblyListItem = { 'id': 0, 'assemblyName': '' };
    this.workOrder = {
      id: 0,
      workOrderNo: '',
      workOrderDate: moment().format('DD/MM/YYYY'),
      machine: machineItem,
      assembly: assemblyItem,
      qty: 0
    }

    this.activateRoute.params.subscribe(
      params => {
        let id = +params['id'];
        if (Number.isNaN(id) == false) {
          this.getWorkOrder(id);
        }
      });
    Global.setLoadingFlag(true);
    this.machineService.getMachineList().subscribe(list => {
      if (list.Success) {
        this.machineList = list.data;
        Global.setLoadingFlag(false);
      } else {
        Global.setLoadingFlag(false);
        this.showMessage(MessageType.Error, "Error", list.Message);
      }

    }, (error: AppError) => {
      Global.setLoadingFlag(false);
      if (error instanceof NotFoundError) {
        this.showMessage(MessageType.Error, "Error", "Requested data not found.");
      }
      else if (error instanceof BadRequestError) {
        this.showMessage(MessageType.Error, "Error", "Unable to process the request.");
      }
      else throw error;
    }, () => {
      this.assemblyService.getAssemblyList().subscribe(list => {
        if (list.Success) {
          this.assemblyList = list.data;
          Global.setLoadingFlag(false);
        } else {
          Global.setLoadingFlag(false);
          this.showMessage(MessageType.Error, "Error", list.Message);
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
    });
  }

  getWorkOrder(id: number) {
    Global.setLoadingFlag(true);
    this.workOrderService.getWorkOrder(id).subscribe(
      wo => {
        if (wo.Success) {
          this.workOrder = wo.data[0];
          //console.log(this.workOrder);
          if (this.workOrder.assembly.id === 0){
            this.buildMachine = true;
          }
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



  setSelectionBox(status: boolean) {
    this.workOrder.assembly = { 'id': 0, 'assemblyName': '' };
    this.workOrder.machine = { 'id': 0, 'machineName': '' }

  }

  onMachineChange(event) {
    console.log(event.value);
  }

  onAssemblyChange(event) {
    console.log(event.value);
  }

  saveForm() {
    //console.log(this.workOrder);

    if (this.workOrder.id > 0) {
      this.workOrderService.updateWorkorder(this.workOrder)
      .subscribe(revData => {
        if (revData.Success){
          Global.setLoadingFlag(false);
          this.showToastMessage('success','','Workorder saved successfully.');
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
    } else { 
      Global.setLoadingFlag(true);
      this.workOrderService.createWorkorder(this.workOrder)
      .subscribe(revData => { 
        if (revData.Success){
          this.workOrder.id = revData.data[0];
          Global.setLoadingFlag(false);
          this.showToastMessage('success','','Workorder updated successfully.');
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

  showToastMessage(severity:string, summary: string, detail:string){
    let message: Message = {
      severity: severity,
      summary: summary,
      detail:detail
    }
    this.messageService.add(message);
  }
}
