
import { MachineCategoryService } from '../../core/services/machineCategory.service';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, CanDeactivate, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IMachine } from '../../model/machine';


import { MachineService } from '../../core/services/machine.service';
import { IMachineCategory } from '../../model/machineCategory';
import { IVMMachine } from '../../model/viewModel/machineViewModels/vmMachine';
import { IVMMachineAssembly } from '../../model/viewModel/machineViewModels/vmMachineAssembly';
import { IAssembly } from '../../model/assembly';
import { IDesignation } from '../../model/designation';
import { DesignationService } from '../../core/services/designation.service';
import { IVMMachineDesignation } from '../../model/viewModel/machineViewModels/vmMachineDesignation';

//import { mcall } from 'q';
interface ISelectionListItem{
  id:number,
  itemName:string
}

@Component({
  selector: 'machine-form',
  templateUrl: './machine-form.component.html',
  styleUrls: ['./machine-form.component.css']
})
export class MachineFormComponent implements OnInit {

  private sub: Subscription;
  form: FormGroup;

  orientationValues: string[] = ['Horizontal', 'Vertical'];
  shapeValues: string[] = ['Cylindrical', 'Rectangular'];
  doorTypeValues: string[] = [
    'Single manual door',
    'Two manual doors',
    'Single auto. vertical sliding door',
    'Single auto. horizontal sliding door',
    'Two auto. vertical sliding doors',
    'Two auto. horizontal Sliding doors'];


  machineCategories: IMachineCategory[];
  selectedMachineCategory: IMachineCategory;

  machineTypeValues: string[] = ['Automatic', 'Manual'];
  machineInstallationTypes: string[] = [
    'Standing',
    'Table Top'
  ];
  machine: IVMMachine = {
    "id": 0,
    "machineName": "",
    "categoryId": 0,
    "modelNo": "",
    "installationType": "",
    "orientation": "",
    "shape": "",
    "doorType": "",
    "machineType": "",
    "machineAssemblies": [],
    "machineDesignations":[],
  }
  designationsList: ISelectionListItem[] = [];
  selectedDesignations: ISelectionListItem[] = [];
  dropdownSettings = {};
  errorMessage: string; 
  desigListFromServer:IDesignation[];


  constructor(fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute, 
    private machineService: MachineService,
    private designationService: DesignationService,
    private machineCategoryService: MachineCategoryService
  ) {
    this.form = fb.group({
      machineName: ['', Validators.required],
      modelNo: ['', Validators.required],
      machineCategory: [],
      installationType: [],
      orientation: [this.orientationValues[0]],
      shape: [this.shapeValues[0]],
      doorType: [this.doorTypeValues[0]],
      machineType: [this.machineTypeValues[0]],
      machineAssemblies: [[]],
      machineDesignations: [[]],
    });

  }

  ngOnInit(): void {
    this.getAllMachineCategories();
    this.sub = this.activateRoute.params.subscribe(
      params => {
        let id = +params['id'];
        if (Number.isNaN(id) == false) {
          this.getMachine(id);
        }

      });
      this.getAllDesignations();
  }

  //retrive selected machine values
  getMachine(id: number) {
    this.machineService.getMachine(id).subscribe(
      mac => {
        this.machine = mac;
        //this.getModelNamefromId();
        this.getMachineCategory(); 
      },
      error => this.errorMessage = <any>error,
      ()=>{
        this.machine.machineDesignations.forEach(desig =>{
          let designationItem:ISelectionListItem = {
            id : desig.designationId,
            itemName : desig.title
          }
          this.selectedDesignations.push(designationItem);
        });
      });
  }

  getMachineCategory() {
    this.machineCategoryService.getMachineCategory(this.machine.categoryId).subscribe(
      mCategory => {
        this.selectedMachineCategory = this.machineCategories.find(c => c.id === mCategory.id);
      },
      error => this.errorMessage = <any>error);
  }

  //get all machine categories
  getAllMachineCategories() {
    this.machineCategoryService.getMachineCategories().subscribe(
      categoriesData => {
        this.machineCategories = categoriesData;
      },
      error => this.errorMessage = <any>error);
  }

  setCategory(category: IMachineCategory) {
    if (category === undefined) return;
    this.machine.categoryId = category.id;
  }

  cancelForm(event: Event) {
    if (this.form.dirty) {
    }
    this.router.navigate(['/machines']);
  }

  saveForm() {
    //if (this.machine.id != 0) {
      this.selectedDesignations.forEach(desig => {
        let selDesig: IVMMachineDesignation = {
          machineId:this.machine.id,
          designationId: desig.id,
          title: desig.itemName
        }
        this.machine.machineDesignations.push(selDesig);
      });
    this.machine.categoryId = this.selectedMachineCategory.id;
    console.log(this.machine);
    //}
  }


  get machineName() {
    return this.form.get("machineName");
  }

  get modelNo() {
    return this.form.get("modelNo");
  }

  get installationType() {
    return this.form.get("installationType");
  }

  get orientation() {
    return this.form.get("orientation");
  }

  get shape() {
    return this.form.get("shape");
  }

  get doorType() {
    return this.form.get("doorType");
  }

  get machineType() {
    return this.form.get("machineType");
  }

  get machineCategory() {
    return this.form.get("machineCategory");
  }

  get machineDesignations(){return this.form.get('machineDesignations') }

  addAssembly(asm: IAssembly) {
    
    let subAssembly: IVMMachineAssembly = {
      "machineId": this.machine.id,
      "assemblyId": asm.id,
      "assemblyName": asm.assemblyName,
      "qty": 1
    }
    let assemblyFound = this.machine.machineAssemblies.find(a => a.assemblyId == asm.id)

    if (assemblyFound === undefined) {
      this.machine.machineAssemblies.push(subAssembly);
    } else {
      assemblyFound.qty = assemblyFound.qty + 1;
    }
  }

  removeSubAssembly(asm: IVMMachineAssembly) {

    let index = this.machine.machineAssemblies.findIndex(a => a.assemblyId == asm.assemblyId);
    if (index >= 0) {
      this.machine.machineAssemblies.splice(index, 1);
    }
  }


  getAllDesignations(){
    this.designationService.getDesignations().subscribe(
      designationData => {
        this.desigListFromServer = designationData;
      },
      error => this.errorMessage = <any>error,
      ()=>{
        //console.log(this.designationsList);
        this.desigListFromServer.forEach(desig => {
          let designation:ISelectionListItem = {
            id: desig.id,
            itemName: desig.title
          }
          this.designationsList.push(designation);
        });
     }
    )
  }

}
