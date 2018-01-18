import { DesignationService } from '../../core/services/designation.service';
import { EmployeeService } from '../../core/services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IDesignation } from '../../model/designation';
import { Subscription } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { IEmployee } from '../../model/employee';

@Component({
  selector: 'employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {

  private sub: Subscription;
  form: FormGroup;
  designations:IDesignation[];
  selectedDesignation: IDesignation;
  employee: IEmployee = {
    "id": 0,
    "firstName": "",
    "lastName": "",
    "designationId":0,
    "designation":"",
    "username": "",
    "password": ""
    
  }

  errorMessage: string;
  constructor(fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private designationService: DesignationService) {
      this.form = fb.group({
        firstName:['',Validators.required],
        lastName: ['',Validators.required],
        designation: ['',Validators.required],
        username: [],
        password: []
        
      });
     }

  ngOnInit() :void {
    this.getAllDesignations();
    this.sub = this.activateRoute.params.subscribe(
      params => {
        let id = +params['id'];
        if (Number.isNaN(id) == false) {
          this.getEmployee(id);
        }
      });
  }

  getAllDesignations(){
    this.designationService.getDesignations()
    .subscribe(
      designationsData => {this.designations = designationsData;
    },error=>this.errorMessage=<any>error);
  }

  getEmployee(id:number){
    this.employeeService.getEmployee(id).subscribe(
      emp => {
        this.employee = emp;
        this.getEmployeeDesignation();
      },
      error => this.errorMessage = <any>error);
    
  }

  getEmployeeDesignation() { 
    
        this.selectedDesignation = this.designations.find(d => d.id === this.employee.designationId);
      
  }

  saveForm(){
    //if (this.employee.id != 0) {
      this.employee.designationId = this.selectedDesignation.id;
      console.log(this.employee);
    //}
  }

  cancelForm(){
    this.router.navigate(['/employees']);
  }

}