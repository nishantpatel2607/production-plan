import { DesignationService } from '../../core/services/designation.service';
import { EmployeeService } from '../../core/services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IDesignation } from '../../model/designation';
import { Subscription } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { IEmployee } from '../../model/employee';
import { MessageType, MessageBoxComponent } from '../../shared/message-box/message-box.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { AppError } from '../../errorhandlers/app-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';

@Component({
  selector: 'employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {

  private sub: Subscription;
  form: FormGroup;
  designations: IDesignation[];
  selectedDesignation: IDesignation;
  employee: IEmployee = {
    "id": 0,
    "firstName": "",
    "lastName": "",
    "designationId": 0,
    "designation": "",
    "username": "",
    "password": ""

  }

  errorMessage: string;
  constructor(fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private designationService: DesignationService,
    private dialogService: DialogService) {
    this.form = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      designation: ['', Validators.required],
      username: [],
      password: []

    });
  }

  ngOnInit(): void {

    this.sub = this.activateRoute.params.subscribe(
      params => {
        let id = +params['id'];
        if (Number.isNaN(id) == false) {
          this.getEmployee(id);
        }
      });

    console.log(this.employee.id);
    if (this.employee.id == 0) {
      this.getAllDesignations();
    }
  }

  getAllDesignations() {
    this.designationService.getDesignations()
    .subscribe(designationData => {
      if (designationData.Success) {
        this.designations = designationData.data;
       
      } else {
        this.showMessage(MessageType.Error, "Error", designationData.Message);
      }
    },
      (error: AppError) => {
        //this.loading = false;
        if (error instanceof NotFoundError) {
          this.showMessage(MessageType.Error, "Error", "Requested data not found.");
        }
        else if (error instanceof BadRequestError) {
          this.showMessage(MessageType.Error, "Error", "Unable to process the request.");
        }
        else throw error;
      })
  }

  getEmployee(id: number) {
    this.employeeService.getEmployee(id).subscribe(
      emp => {
        this.employee = emp;
        //this.getEmployeeDesignation();
      },
      (error: AppError) => {
        //this.loading = false;
        if (error instanceof NotFoundError) {
          this.showMessage(MessageType.Error, "Error", "Requested data not found.");
        }
        else if (error instanceof BadRequestError) {
          this.showMessage(MessageType.Error, "Error", "Unable to process the request.");
        }
        else throw error;
      },
      () => {
        this.designationService.getDesignations()
        .subscribe(designationData => {
          if (designationData.Success) {
            this.designations = designationData.data;
           
          } else {
            this.showMessage(MessageType.Error, "Error", designationData.Message);
          }
        }, (error: AppError) => {
            //this.loading = false;
            if (error instanceof NotFoundError) {
              this.showMessage(MessageType.Error, "Error", "Requested data not found.");
            }
            else if (error instanceof BadRequestError) {
              this.showMessage(MessageType.Error, "Error", "Unable to process the request.");
            }
            else throw error;
          }

      )
      });

  }

  getEmployeeDesignation() {

    this.selectedDesignation = this.designations.find(d => d.id === this.employee.designationId);

  }

  saveForm() {
    //if (this.employee.id != 0) {
    this.employee.designationId = this.selectedDesignation.id;
    console.log(this.employee);
    //}
  }

  cancelForm() {
    this.router.navigate(['/employees']);
  }

  showMessage(messageType: MessageType, title: string, message: string) {

    let disposable = this.dialogService.addDialog(MessageBoxComponent, {
      title: title,
      messageType: messageType,
      message: message

    }).subscribe((isConfirmed) => { });
  }
}