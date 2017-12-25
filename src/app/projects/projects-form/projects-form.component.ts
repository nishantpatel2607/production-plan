import { Component, OnInit } from '@angular/core'; 
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { IJob } from '../../model/job';
import { ActivatedRoute, Router } from '@angular/router';
import { IOrder } from '../../model/orderMaster';
import { OrderService } from '../../core/services/order.service';
import { JobService } from '../../core/services/job.service';

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
  order : IOrder = {
    id: 0,
    orderNo: "",
    orderDate: "",
    orderDescription: "",
    orderStatus : 1
  }
  
  
  constructor(fb: FormBuilder,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private orderService: OrderService,
    private jobService: JobService
  ) {
    this.form = fb.group({
      orderNo: ['', Validators.required],
      orderDate: ['', Validators.required],
      job: ['', Validators.required],
      orderDescription: ['']
    });
   }

  ngOnInit() {
    this.getTopLevelJobs();
  }

  getTopLevelJobs() {
    
  }

  getOrder(id: number){
    this.orderService.getOrder(id).subscribe(
      order => {
        this.order = order;
        this.getJob();
      }
    )
  }

  getJob(){}


  cancelForm(event: Event) {
    if (this.form.dirty) {
    }
    this.router.navigate(['/projects']);
  }

  saveForm() {
    if (this.order.id != 0) {
      console.log(this.order);
    }
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
