import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'machine-form',
  templateUrl: './machine-form.component.html',
  styleUrls: ['./machine-form.component.css']
})
export class MachineFormComponent implements OnInit {

  form;

  orientationValues: string[] = ['Horizontal','Vertical'];
  shapeValues: string[] = ['Cylindrical','Rectangular'];
  doorTypeValues: string[] = [
    'Single manual door',
    'Two manual doors',
    'Single auto. vertical sliding door',
    'Single auto. horizontal sliding door',
    'Two auto. vertical sliding doors',
    'Two auto. horizontal Sliding doors'];
  
    machineTypeValues: string[] = ['Automatic','Manual'];

  constructor(fb: FormBuilder, private router: Router) {
    this.form = fb.group({
      machineSrNo: ['', Validators.required],
      orientation: [this.orientationValues[0]],
      shape: [this.shapeValues[0]],
      doorType: [this.doorTypeValues[0]],
      machineType: [this.machineTypeValues[0]]
    });
   }

  ngOnInit() {
  }

  save(){

  }

  cancelForm(){
    this.router.navigate(['/machines']);
  }

  get machineSrNo(){
    return this.form.get("machineSrNo");
  }

  get orientation(){
    return this.form.get("orientation");
  }

  get shape(){
    return this.form.get("shape");
  }

  get doorType(){
    return this.form.get("doorType");
  }

  get machineType(){
    return this.form.get("machineType");
  }

}
