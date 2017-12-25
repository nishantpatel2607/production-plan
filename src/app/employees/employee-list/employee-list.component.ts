
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PagerService } from '../../core/services/pager.service';

import { EmployeeService } from '../../core/services/employee.service';
import { IEmployee } from '../../model/employee';

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
  
  constructor(private activeRoute: ActivatedRoute,
     private route: Router,
      private employeeService: EmployeeService,
      private pagerService: PagerService) { }

  //sorting
  key: string = 'firstName'; //set default
  reverse: boolean = false;
  sort(key){
    this.key = key;
    this.reverse = !this.reverse;  
  }

  ngOnInit() {
    this.employeeService.getEmployees()
    .subscribe(employeesData => {
    this.employees = employeesData;
    this.filteredItems = employeesData;
      this.setPage(1);
    },
    error => this.errorMessage = <any>error);
  }

  newEmployee() {
    this.route.navigate(['employees/new']);
  }

  deleteEmployees() {
    if (this.checkedItems.length > 0) {
      //alert(this.checkedItems.length);
      for (let employee of this.checkedItems) {
        let index = this.filteredItems.indexOf(employee);
        if (index !== -1)
          this.filteredItems.splice(index, 1);
        index = this.employees.indexOf(employee);
        if (index !== -1)
          this.checkedItems.splice(index, 1);
      }
      this.setPage(1);
    }
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

}
