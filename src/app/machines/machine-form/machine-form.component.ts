import { MachineModelService } from '../../core/services/machineModel.service';
import { MachineCategoryService } from '../../core/services/machineCategory.service';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, CanDeactivate, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IMachine } from '../../model/machine';


import { MachineService } from '../../core/services/machine.service';
import { IMachineCategory } from '../../model/machineCategory';
import { IMachineModel } from '../../model/machineModel';
import { mcall } from 'q';


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
  selectedMachineModel: IMachineModel;
  machineModels: IMachineModel[];
  machineTypeValues: string[] = ['Automatic', 'Manual'];
  machine: IMachine = {
    id: 0,
    modelId: 0,
    machineSrNo: "",
    orientation: "",
    shape: "",
    doorType: "",
    machineType: "",
    machineDescription: ""
  }
  errorMessage: string;


  constructor(fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private machineService: MachineService,
    private machineCategoryService: MachineCategoryService,
    private machineModelService: MachineModelService) {
    this.form = fb.group({
      machineSrNo: ['', Validators.required],
      machineCategory: [],
      model: ['', Validators.required],
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
        this.getModelNamefromId();
      },
      error => this.errorMessage = <any>error);
  }

  getModelNamefromId() {
    this.machineModelService.getMachineModel(this.machine.modelId).subscribe(
      mModel => {
        this.getMachineCategory(mModel);
      },
      error => this.errorMessage = <any>error);

  }

  getMachineCategory(model: IMachineModel) {
    this.machineCategoryService.getMachineCategory(model.categoryId).subscribe(
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
  getMachineModels(category: IMachineCategory) {
    if (category === undefined) return;
    this.machineModelService.getMachineModelsByCategory(category.id)
      .subscribe(modelData => {
        this.machineModels = modelData;
        if (this.machine.id !== 0) {
          this.selectedMachineModel = this.machineModels.find(m => m.id === this.machine.modelId);
        }
      },
      error => this.errorMessage = <any>error);
  }

  //assign modelID to machine object modelId property on selectiong value
  //in model combo box
  setModel(model: IMachineModel) {
    if (model === undefined) return;
    this.machine.modelId = model.id;
  }


  cancelForm(event: Event) {
    if (this.form.dirty) {
    }
    this.router.navigate(['/machines']);
  }

  saveForm() {
    if (this.machine.id != 0) {
      console.log(this.machine);
    }
  }


  get machineSrNo() {
    return this.form.get("machineSrNo");
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

  get model() {
    return this.form.get("model");
  }

  get machineCategory() {
    return this.form.get("machineCategory");
  }

}
