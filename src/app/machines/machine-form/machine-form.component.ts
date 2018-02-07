
import { MachineCategoryService } from '../../core/services/machineCategory.service';
 
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, CanDeactivate, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IMachine } from '../../model/machine';


import { MachineService } from '../../core/services/machine.service';
import { IMachineCategory } from '../../model/machineCategory';

//import { mcall } from 'q';


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
  machineInstallationTypes:string[] = [
    'Standing',
    'Table Top'
  ];
  machine: IMachine = {
    id: 0,
    machineName:"",
    categoryId:0,
    modelNo: "",
    installationType:"",
    orientation: "",
    shape: "",
    doorType: "",
    machineType: "",
    
  }
  errorMessage: string;


  constructor(fb: FormBuilder, 
    private router: Router,
    private activateRoute: ActivatedRoute,
    private machineService: MachineService,
    private machineCategoryService: MachineCategoryService
    ) {
    this.form = fb.group({
      machineName: ['', Validators.required],
      modelNo: ['',Validators.required],
      machineCategory: [],
      installationType: [],
      orientation: [this.orientationValues[0]],
      shape: [this.shapeValues[0]],
      doorType: [this.doorTypeValues[0]],
      machineType: [this.machineTypeValues[0]]
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

  }

  //retrive selected machine values
  getMachine(id: number) {
    this.machineService.getMachine(id).subscribe( 
      mac => {
      this.machine = mac;
        //this.getModelNamefromId();
        this.getMachineCategory();
      },
      error => this.errorMessage = <any>error);
  }

  // getModelNamefromId() {
  //   this.machineModelService.getMachineModel(this.machine.modelId).subscribe(
  //     mModel => {
  //       this.getMachineCategory(mModel);
  //     },
  //     error => this.errorMessage = <any>error); 

  // }

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

  //get all models of selected category
  // getMachineModels(category: IMachineCategory) {
  //   if (category === undefined) return;
  //   this.machineModelService.getMachineModelsByCategory(category.id)
  //     .subscribe(modelData => {
  //       this.machineModels = modelData;
  //       if (this.machine.id !== 0) {
  //         this.selectedMachineModel = this.machineModels.find(m => m.id === this.machine.modelId);
  //       }
  //     },
  //     error => this.errorMessage = <any>error);
  // }

  //assign modelID to machine object modelId property on selectiong value
  //in model combo box
  // setModel(model: IMachineModel) {
  //   if (model === undefined) return;
  //   this.machine.modelId = model.id;
  // }


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

}
