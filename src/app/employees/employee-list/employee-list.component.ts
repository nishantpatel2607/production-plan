
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PagerService } from '../../core/services/pager.service';

import { EmployeeService } from '../../core/services/employee.service';
import { IEmployee } from '../../model/employee';
import { MessageBoxComponent, MessageType } from '../../shared/message-box/message-box.component';
import { DialogService } from 'ng2-bootstrap-modal';
import { AppError } from '../../errorhandlers/app-error';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';
import { Global } from '../../core/services/global';
import { toastMessage } from '../../model/toastMessage';
import { MessageService } from 'primeng/components/common/messageservice';
import { Message } from 'primeng/components/common/api';
@Component({
  selector: 'employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  pageTitle: string = "Employees";
  employees: IEmployee[];
  errorMessage: string;
  listFilter: string = "";

  pager: any = {};
  pagedItems: IEmployee[];
  filteredItems: IEmployee[];

  checkedItems: IEmployee[];
  loading: boolean = false;
  messageConfirm: boolean = false;
  constructor(private activeRoute: ActivatedRoute,
    private route: Router,
    private employeeService: EmployeeService,
    private pagerService: PagerService,
    private dialogService: DialogService,
    private messageService: MessageService) { }

  //sorting
  key: string = 'firstName'; //set default
  reverse: boolean = false;
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  ngOnInit() {
    Global.setLoadingFlag(true); // Global.loadingFlag = true;
    this.employeeService.getEmployees()
      .subscribe(employeesData => {
        if (employeesData.Success) {
          this.employees = employeesData.data;
          this.filteredItems = employeesData.data;
          this.setPage(1);
          Global.setLoadingFlag(false); // Global.loadingFlag = true;
        } else {
          Global.setLoadingFlag(false); // Global.loadingFlag = true;
          this.showMessage(MessageType.Error, "Error", employeesData.Message); 
        }
      },
        (error: AppError) => {
          Global.setLoadingFlag(false); // Global.loadingFlag = true;
          if (error instanceof NotFoundError) {
            this.showMessage(MessageType.Error, "Error", "Requested data not found.");
          }
          else if (error instanceof BadRequestError) {
            this.showMessage(MessageType.Error, "Error", "Unable to process the request.");
          }
          else throw error;
        });
  }

  newEmployee() {
    this.route.navigate(['employees/new']);
  }

  deleteEmployee(employee: IEmployee) {
    let disposable = this.dialogService.addDialog(MessageBoxComponent, {
      title: "Delete?",
      messageType: MessageType.Question,
      message: "Do you want to delete selected employee?"

    }).subscribe((isConfirmed) => {
      if (isConfirmed) {
        //console.log(isConfirmed);
        var index = this.employees.findIndex(c => c.id === employee.id);
        if (index >= 0) {
          Global.setLoadingFlag(true); // Global.loadingFlag = true;
          this.employeeService.deleteEmployee(employee.id).subscribe(
            responseData => {
              if (responseData.Success) {
                //console.log(index);
                this.employees.splice(index, 1);
                this.filteredItems = this.employees;
                this.setPage(1);
                Global.setLoadingFlag(false); // Global.loadingFlag = true;
                this.showToastMessage('success','','Employee record deleted successfully.');
              } else {
                Global.setLoadingFlag(false); // Global.loadingFlag = true;
                this.showMessage(MessageType.Error, 'Error', responseData.Message);
                return;
              }
            }
          )


        }
      }
    });
  }

  selectedItem(employee, event) {
    if (event.target.checked) {
      this.checkedItems.push(employee);
      //alert(machine.machineSrNo);
    }
  }

  setPage(page: number) {
    if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages > 0)) {
      return;
    }

    // get pager object from service
    this.pager = this.pagerService.getPager(this.filteredItems.length, page);

    // get current page of items
    this.pagedItems = this.filteredItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
   
    this.checkedItems = [];
  }

  filterRecords(value) {
    this.listFilter = value;
    var valueToSearch = this.listFilter.toUpperCase().trim();
    this.filteredItems = [];
    if (this.listFilter != "") {
      this.employees.forEach(employee => {
        if (employee.firstName.toUpperCase().indexOf(valueToSearch) >= 0
          || employee.lastName.toUpperCase().indexOf(valueToSearch) >= 0
          || employee.designation.toUpperCase().indexOf(valueToSearch) >= 0
        ) {
          this.filteredItems.push(employee);
        }
      });
    } else {
      this.filteredItems = this.employees;
    }
    // console.log(this.filteredItems);
    this.setPage(1);

  }

  showMessage(messageType: MessageType, title: string, message: string) {

    let disposable = this.dialogService.addDialog(MessageBoxComponent, {
      title: title,
      messageType: messageType,
      message: message

    }).subscribe((isConfirmed) => { this.messageConfirm = isConfirmed; });
  }
  
  showToastMessage(severity:string, summary: string, detail:string){
    let message: Message = {
      severity: severity,
      summary: summary,
      detail:detail
    }
    this.messageService.add(message);
  }
  

}
