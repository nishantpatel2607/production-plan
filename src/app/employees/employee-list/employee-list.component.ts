
import { EmployeeService } from '../../core/services/employee.service';
import { IEmployee } from '../../model/employee';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  pageTitle: string = "Employees";
  employees: IEmployee[];
  errorMessage: string;

  settings = {
    columns: {
      
      firstname: {
        title: 'First Name'
      },
      lastname: {
        title: 'Last Name'
      },
      designayion: {
        title: 'Designation'
      }
    }
  };
  constructor(private activeRoute: ActivatedRoute,
     private route: Router,
      private employeeService: EmployeeService) { }

  ngOnInit() {
    this.employeeService.getEmployees()
    .subscribe(employeesData => {
    this.employees = employeesData;
    //this.filteredItems = machinesData;
      //this.setPage(1);
    },
    error => this.errorMessage = <any>error);
  }

  newEmployee() {
    this.route.navigate(['employees/new']);
  }
}
