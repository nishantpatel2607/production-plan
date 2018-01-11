import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { IJob } from '../../model/job';
import { ActivatedRoute, Router } from '@angular/router';
import { IWorkOrder } from '../../model/orderMaster';
import { WorkOrderService } from '../../core/services/workOrder.service';
import { JobService } from '../../core/services/job.service';
import {IMyDpOptions, IMyDateModel} from 'angular4-datepicker/src/my-date-picker/interfaces';

@Component({
  selector: 'app-projects-form',
  templateUrl: './projects-form.component.html',
  styleUrls: ['./projects-form.component.css']
})
export class ProjectsFormComponent implements OnInit {
  
  form: FormGroup;
  topLevelJobs:IJob[] = [];
  selectedJob:IJob;
  errorMessage: string;
  order : IWorkOrder = {
    id: 0,
    workOrderNo:"",
    orderNo: "",
    orderDate: "",
    jobId: 0,
    orderDescription: "",
    orderStatus : 1
  }
  
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mm/yyyy'
  };
  
  constructor(fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private workorderService: WorkOrderService,
    private jobService: JobService
  ) {
    this.form = fb.group({
      workOrderNo:['', Validators.required],
      orderNo: [''],
      orderDate: ['', Validators.required],
      job: ['', Validators.required],
      orderDescription: ['']
    });
   }

  ngOnInit() {
    this.getTopLevelJobs();
    this.activateRoute.params.subscribe(
      params => {
        let id = +params['id'];
        if (Number.isNaN(id) == false) {
          this.getOrder(id);
        }

      });
  }

  getTopLevelJobs() {
    this.jobService.getTopLevelJobs().subscribe(
      jobs => {this.topLevelJobs = jobs;}
    )
  }

  getOrder(id: number){
    this.workorderService.getOrder(id).subscribe(
      order => {
        this.order = order;
        console.log(this.order);
        this.form.patchValue({orderDate : {formatted:this.order.orderDate}});
        this.getJob();
      },(error)=>{},()=>{}
    )
  }

  getJob(){
    this.jobService.getJob(this.order.jobId).subscribe(
      mJob => {
        this.selectedJob = this.topLevelJobs.find(j => j.id === mJob.id);
        console.log(this.selectedJob);
      },
      error => this.errorMessage = <any>error);
      
  }


  cancelForm(event: Event) {
    if (this.form.dirty) {
    }
    this.router.navigate(['/projects']);
  }

  saveForm() {
    if (this.order.id != 0) {
      //store the text value from date control instead of date object
      this.order.orderDate = this.orderDate.value.formatted;
      console.log(this.order);
    }
  }

  get workOrderNo(){
    return this.form.get("workOrderNo");
  }

  get orderNo(){
    return this.form.get("orderNo");
  }

  get orderDate(){
    return this.form.get("orderDate");
  }

  get job(){
    return this.form.get("job");
  }

  get orderDescription(){
    return this.form.get("orderDescription");
  }
}
