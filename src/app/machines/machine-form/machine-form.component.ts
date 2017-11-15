
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, CanDeactivate, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { IMachine } from '../../model/machine';


import { MachineService } from '../../core/services/machine.service';


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

  machineTypeValues: string[] = ['Automatic', 'Manual'];
  machine: IMachine = {
    id: 0,
    modelId:0,
    machineSrNo: "",
    orientation: "",
    shape: "",
    doorType: "",
    machineType: "",
    machineDescription:""
  }
  errorMessage: string;


  constructor(fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private machineService: MachineService) {
    this.form = fb.group({
      machineSrNo: ['', Validators.required],
      orientation: [this.orientationValues[0]],
      shape: [this.shapeValues[0]],
      doorType: [this.doorTypeValues[0]],
      machineType: [this.machineTypeValues[0]]
    });
  }

  ngOnInit(): void {
    this.sub = this.activateRoute.params.subscribe(
      params => {
        let id = +params['id'];
        if (Number.isNaN(id) == false)
          this.getMachine(id);

      });

  }

  getMachine(id: number) {
    this.machineService.getMachine(id).subscribe(
      mac => this.machine = mac,
      error => this.errorMessage = <any>error);
  }

  

  cancelForm(event: Event) {
    
    
    if (this.form.dirty) {
     
    this.router.navigate(['/machines']);
        
      
    }
    
    
  }

  saveForm(){
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

}
