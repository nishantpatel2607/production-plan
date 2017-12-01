import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { IJob } from '../../model/job';
import { Component, OnInit } from '@angular/core';
import { TREE_ACTIONS, IActionMapping } from 'angular-tree-component';
import { JobService } from '../../core/services/job.service';
import { IMachine } from '../../model/machine';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css']
})
export class JobFormComponent implements OnInit {

 
  nodes;
  jobs: IJob[];
  errorMessage: string;
  form: FormGroup;
  formHidden:boolean = true;
  selectedMachine: IMachine;
  

  job: IJob = {
    "id": 0,
    "jobName": "",
    "machineId":0,
    "jobSequenceNo": 0,
    "jobDescription": "",
    "parentJobId": 0,
    "durationInMins":0
  }



  constructor(private jobService: JobService,
  fb: FormBuilder)
  {
  this.form = fb.group ({
    jobName: ['',Validators.required],
    machine :[],
    jobSequenceNo: ['',[Validators.required,Validators.pattern('^[0-9]+$')]],
    jobDescription: [],
    parentJob: [{value: '', disabled: true}],
    parentJobId:[],
    durationInMins: ['',[Validators.required,Validators.pattern('^[0-9]+$')]]
  });
  }

  ngOnInit() {
    this.jobService.getJobs()
      .subscribe(jobData => {
        this.jobs = jobData;
        this.getJobHierarchy();
        console.log(this.nodes);
      },
      error => this.errorMessage = <any>error);
  }

  getJobHierarchy() {
    
    let jobs1: any[] = this.jobs;
    var map = {};
    for (var i = 0; i < jobs1.length; i++) {
      var obj = jobs1[i];
      obj.name = obj.jobName;
      obj.children = [];

      map[obj.id] = obj;

      var parent = obj.parentJobId || '-';
      if (!map[parent]) {
        map[parent] = {
          children: []
        };
      }
      map[parent].children.push(obj);
    }

    this.nodes = map['-'].children;

  }

  newJob(){
    this.formHidden = false;
  }

  deleteJob(){}

  saveForm(){}

  cancelForm(){
    this.formHidden = true;
  }

getJobName(){return this.form.get("jobName");}
getMachine(){return this.form.get("machine");}
getJobSequenceNo(){return this.form.get("jobSequenceNo");}
getJobDescription(){return this.form.get("jobDescription");}
getParentJob(){return this.form.get("parentJob");}
getDurationInMins(){return this.form.get("durationInMins");}
}
