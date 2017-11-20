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
  employee: IEmployee = {
    "id": 0,
    "firstName": "",
    "lastName": "",
    "designation":"",
    "username": "",
    "password": "",
    "marking": false,
    "cuttingShearing": false,
    "sheetBending": false,
    "pipeBending": false,
    "straightening": false,
    "gauging": false,
    "pipeFitting": false,
    "insulation": false,
    "testing": false,
    "fittingAssembly": false,
    "filletWeld": false,
    "buttWeld": false,
    "rootWeld": false,
    "backChipping": false,
    "tagWeld": false,
    "edgeWeld": false,
    "pipeWeld": false,
    "cleaning": false,
    "packing": false,
    "handling": false,
    "filing": false,
    "grinding": false,
    "drilling": false,
    "tapping": false,
    "hacksawCutting": false,
    "painting": false,
    "helperTagWeld": false,
    "buffer": false,
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
        password: [],
        marking: [],
        cuttingShearing: [],
        sheetBending: [],
        pipeBending: [],
        straightening: [],
        gauging: [],
        pipeFitting: [],
        insulation: [],
        testing: [],
        fittingAssembly: [],
        filletWeld: [],
        buttWeld: [],
        rootWeld: [],
        backChipping: [],
        tagWeld: [],
        edgeWeld: [],
        pipeWeld: [],
        cleaning: [],
        packing: [],
        handling: [],
        filing: [],
        grinding: [],
        drilling: [],
        tapping: [],
        hacksawCutting: [],
        painting: [],
        helperTagWeld: [],
        buffer: []
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
      },
      error => this.errorMessage = <any>error);
    
  }

  saveForm(){
    if (this.employee.id != 0) {
      console.log(this.employee);
    }
  }

  cancelForm(){
    this.router.navigate(['/employees']);
  }

}