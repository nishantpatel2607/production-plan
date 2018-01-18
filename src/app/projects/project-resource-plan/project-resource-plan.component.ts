import { JobService } from '../../core/services/job.service';
import { IWorkOrder } from '../../model/orderMaster';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOrderService } from '../../core/services/workOrder.service';
import { EmployeeService } from '../../core/services/employee.service';
import { IEmployee } from '../../model/employee';
import { IWorkOrderProject } from '../../model/orderProject';
import { forEach } from '@angular/router/src/utils/collection';
import { DatePipe } from '@angular/common';

interface IProject {
  jobId:number;
  jobName:string;
  jobDesignations:string[];
  startDateTime:string[];
  endDateTime:string[];
  employee:any[];
}

@Component({
  selector: 'app-project-resource-plan',
  templateUrl: './project-resource-plan.component.html',
  styleUrls: ['./project-resource-plan.component.css']
})
export class ProjectResourcePlanComponent implements OnInit {

  workOrder : IWorkOrder = {
    id: 0,
    workOrderNo:"",
    orderNo: "",
    orderDate: "",
    jobId: 0,
    orderDescription: "",
    orderStatus : 1
  }
  datepipe: DatePipe = new DatePipe('en-UK');

  desig:string[] = ["'Fitter'"];
  employees : IEmployee[] = [];
  orderProjects: IWorkOrderProject[] = [];
  jobName:string = '';
  errorMessage: string;
  arProjects = []; //array of projects. 
  totRows:number = 0;
  tableRows=[];
  tableCols =[];

  constructor(private router: Router,
    private activateRoute: ActivatedRoute,
    private workOrderService: WorkOrderService,
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
    this.workOrderService.getOrder(id).subscribe(
      order => {
        this.workOrder = order;
        
        this.getJob();
      }
    )
  }

  getJob(){
    this.jobService.getJob(this.workOrder.jobId).subscribe(
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
    this.workOrderService.getOrderProjects(id)
    .subscribe(projects => {this.orderProjects = projects},()=>{},
  ()=>{
    for(let project of this.orderProjects){
      let projectElement:IProject = {
        jobId:project.jobId,
        jobName:project.jobName,
        jobDesignations:project.jobDesignations,
        startDateTime:[],
        endDateTime:[],
        employee:[]
      }
      //console.log(projectElement);
      this.arProjects.push(projectElement);
    }
   });
  }

  assignEmployee(event,project:IProject){
    if (project.employee.findIndex(emp => emp.id === event.dragData.id ) < 0){
    project.employee.push(event.dragData);}
  }

  removeEmployee(project,emp){
    let index = project.employee.findIndex(e => e.id===emp.id);
      if (index >= 0){
      project.employee.splice(index,1);
    }
  }

  saveForm(){

  }

  cancelForm(){
    this.router.navigate(['/projects']);
  }

  addDateTime(startDt:Date,endDt:Date,projectElement:IProject){
    //console.log(startDt);
    if (startDt === undefined || endDt === undefined){return;}
    if ((startDt.getTime()-endDt.getTime()) > 0){return;}
    projectElement.startDateTime.push(this.datepipe.transform(startDt,'dd/MM/yyyy HH:mm'));
    projectElement.endDateTime.push(this.datepipe.transform(endDt,'dd/MM/yyyy HH:mm'));
  }

  removeDateTime(i:number,projectElement:IProject){
    projectElement.startDateTime.splice(i,1);
    projectElement.endDateTime.splice(i,1);
  }

  
}
