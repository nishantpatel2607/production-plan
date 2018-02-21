import { Component, OnInit } from '@angular/core';
import { IVMWorkOrder } from '../../model/viewModel/workorderModels/vmWorkOrder';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from "moment"
import { IVMMachineListItem } from '../../model/viewModel/machineViewModels/vmMachine';
import { IVMAssemblyListItem } from '../../model/viewModel/assemblyViewModels/vmAssembly';
import { AssemblyService } from '../../core/services/assembly.service';
import { MachineService } from '../../core/services/machine.service';
@Component({
  selector: 'app-workorder-form',
  templateUrl: './workorder-form.component.html',
  styleUrls: ['./workorder-form.component.css']
})
export class WorkorderFormComponent implements OnInit {
  workOrder: IVMWorkOrder;
  form: FormGroup;
  buildMachine = false;
  defualtDate:Date;
  machineList:IVMMachineListItem[];
  assemblyList: IVMAssemblyListItem[];

  constructor(fb: FormBuilder, 
    assemblyService:AssemblyService, 
    machineService: MachineService) {
    this.form = fb.group({
      workOrderNo: ['', Validators.required],
      workOrderDate: ['', Validators.required],
      buildMachine:[],
      machine:  [''],
      assembly: [''],
      qty: ['', Validators.required]
    });
   }

  ngOnInit() {
    let machineItem:IVMMachineListItem = {'id':0, 'machineName':''};
    let assemblyItem:IVMAssemblyListItem = {'id':0, 'assemblyName':''};
   this.workOrder = {
    id:0,
    workOrderNo: '',
    workOrderDate: moment().format('DD/MM/YYYY'),
    machine: machineItem,
    assembly: assemblyItem,
    qty: 0,
    team: [],
    schedule:[]
   }
   this.machineList = [
     {'id': 1, 'machineName': 'machine 1'},
     {'id': 2, 'machineName': 'machine 2'},
     {'id': 3, 'machineName': 'machine 3'},
     {'id': 4, 'machineName': 'machine 4'}
   ];
   this.assemblyList=[
     {'id': 1,'assemblyName': 'assembly 1'},
     {'id': 2,'assemblyName': 'assembly 2'},
     {'id': 3,'assemblyName': 'assembly 3'},
     {'id': 4,'assemblyName': 'assembly 4'}];

   
  }

  /* itemschange(){
    console.log(this.workOrder.machine);
  } */

}
