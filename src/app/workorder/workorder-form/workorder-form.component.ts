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

    this.machineService.getMachineList().subscribe(list => {
      this.machineList = list;
    }, () => { }, () => {
      this.assemblyService.getAssemblyList().subscribe(list => {
        //this.assemblyList = list;
      });
    });
  }

  getWorkOrder(id: number) {
    this.workOrderService.getWorkOrder(id).subscribe(
      wo => {
        this.workOrder = wo;
        console.log(this.workOrder);
        //this.getEmployeeDesignation();
      },
      error => this.errorMessage = <any>error, () => {
        if (this.workOrder.machine.id > 0) {
          this.form.controls['buildMachine'].setValue(true);
        }
      })
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
    console.log(this.workOrder);
  }

  cancelForm() {
    this.router.navigate(['/workorderlist']);
  }

}
