import { JobService } from '../../core/services/job.service';
import { IOrder } from '../../model/orderMaster';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { EmployeeService } from '../../core/services/employee.service';
import { IEmployee } from '../../model/employee';
import { IOrderProject } from '../../model/orderProject';
import { forEach } from '@angular/router/src/utils/collection';

interface IProject {
  jobId:number,
  jobName:string,
  employee:any[]
}

@Component({
  selector: 'app-project-resource-plan',
  templateUrl: './project-resource-plan.component.html',
  styleUrls: ['./project-resource-plan.component.css']
})
export class ProjectResourcePlanComponent implements OnInit {

  order : IOrder = {
    id: 0,
    orderNo: "",
    orderDate: "",
    jobId: 0,
    orderDescription: "",
    orderStatus : 1
  }

  employees : IEmployee[] = [];
  orderProjects: IOrderProject[] = [];
  jobName:string = '';
  errorMessage: string;
  arProjects = []; //array of projects. 
  totRows:number = 0;
  tableRows=[];
  tableCols =[];

  constructor(private router: Router,
    private activateRoute: ActivatedRoute,
    private orderService: OrderService,
    private jobService: JobService,
    private employeeService: EmployeeService) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(
      params => {
        let id = +params['id'];
        if (Number.isNaN(id) == false) {
          this.getOrder(id);
          this.getOrderProjects(id);
        }
      });
      this.getEmployeesList();

  }

  getOrder(id: number){
    this.orderService.getOrder(id).subscribe(
      order => {
        this.order = order;
        
        this.getJob();
      }
    )
  }

  getJob(){
    this.jobService.getJob(this.order.jobId).subscribe(
      mJob => {
        this.jobName = mJob.jobName;
      },
      error => this.errorMessage = <any>error);
  }

  getEmployeesList(){
    this.employeeService.getEmployees()
    .subscribe( employees => {this.employees = employees;});
  }

  getOrderProjects(id: number){
    this.orderService.getOrderProjects(id)
    .subscribe(projects => {this.orderProjects = projects},()=>{},
  ()=>{
    let i:number = 1;
    for(let project of this.orderProjects){
      let projectElement:IProject = {
        jobId:project.JobId,
        jobName:project.jobName,
        employee:[]
      }
      
      this.arProjects.push(projectElement);
      if (i === 3){
        let ar = this.arProjects;
        this.tableRows.push(ar);
        this.arProjects=[];
        i = 1;
      } else {i = i + 1;}

    }
    if (this.arProjects.length > 0) {
      let ar = this.arProjects;
      this.tableRows.push(ar);
    }
    console.log(this.tableRows);
    //this.totRows = Math.ceil(this.arProjects.length/3.0);
    //this.tableRows = new Array(this.totRows);
  });
  }


}
