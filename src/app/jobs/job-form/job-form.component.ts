import { forEach } from '@angular/router/src/utils/collection';
import { IDesignation } from '../../model/designation';
import { DesignationService } from '../../core/services/designation.service';
import { MachineService } from '../../core/services/machine.service';
import { TreeModel } from 'angular-tree-component/dist/models/tree.model';
import { TreeNode } from 'angular-tree-component/dist/models/tree-node.model';
import { TreeComponent } from 'angular-tree-component/dist/components/tree.component';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IJob } from '../../model/job';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TREE_ACTIONS, IActionMapping } from 'angular-tree-component';
import { JobService } from '../../core/services/job.service';
import { IMachine } from '../../model/machine';
import { IJobDesignations } from '../../model/jobDesignations';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css']
})
export class JobFormComponent implements OnInit {

  disableNewChildJobButton = true;
  disableDeleteButton = true;
  nodes;
  jobs: IJob[];
  //arDesignations: any[]=[];
  errorMessage: string; 
  form: FormGroup;
  formHidden: boolean = true;
  selectedMachine: IMachine;
  treeSelectedNodeData;
  treeSelectedNode: TreeNode;
  
  @ViewChild(TreeComponent)
  private tree: TreeComponent;
  
  treeModel: TreeModel;
  machines: IMachine[];
  designationList:IDesignation[];
  disableMachine:boolean = false;
  jobDesignations: IJobDesignations[];

  job: IJob = {
    "id": 0,
    "jobName": "",
    "machineId": 0,
    "jobSequenceNo": 0,
    "jobDescription": "",
    "parentJobId": 0,
    "durationInMins": 0
  }



  constructor(private jobService: JobService,
    private machineService: MachineService,
    private designationService: DesignationService,
    private fb: FormBuilder) {
    this.form = fb.group({
      jobName: ['', Validators.required],
      machine: [{disabled:false}],
      jobSequenceNo: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      jobDescription: [],
      parentJob: [{ value: '', disabled: true }],
      parentJobId: [],
      durationInMins: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      designations: this.fb.array([ ])
    });
  }

  ngOnInit() {
    this.getAllJobs();
    this.getAllMachines();
    this.getAllDesignations();

  }
  ngAfterInit() {
    this.treeModel = this.tree.treeModel;
  }

  buildDesignations(position:IDesignation): FormGroup{
    let fg = this.fb.group({});
    fg.addControl(position.title,new FormControl(false));
    return fg; 
  }

  getAllJobs() {
    this.jobService.getJobs()
      .subscribe(jobData => {
        this.jobs = jobData;
        this.getJobHierarchy();
        //console.log(this.nodes);
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

  getAllMachines() {
    this.machineService.getMachines().subscribe(
      machinesData => {
        this.machines = machinesData;
      },
      error => this.errorMessage = <any>error);

  }

  getMachine() {
    this.machineService.getMachine(this.job.machineId).subscribe(
      mMachine => {
        this.selectedMachine = this.machines.find(c => c.id === mMachine.id);
        //console.log(this.selectedMachine);
      },
      error => this.errorMessage = <any>error);
      
  }

  getAllDesignations(){
    this.designationService.getDesignations().subscribe(
      designationData => {
        this.designationList = designationData;
      },
      error => this.errorMessage = <any>error,
      ()=>{
        console.log(this.designationList);
        for(let position of this.designationList){
          this.designations.push( this.buildDesignations(position));
        }
      }
    )
  }

  newTopJob() {
    this.form.reset();
    this.formHidden = false;

    this.job = {
      "id": 0,
      "jobName": "",
      "machineId": 0,
      "jobSequenceNo": 0,
      "jobDescription": "",
      "parentJobId": 0,
      "durationInMins": 0
    }
    this.parentJob.setValue("");
    this.machine.enable();
  }

  newChildJob() {
    this.form.reset();
    this.formHidden = false;
    this.parentJob.setValue(this.treeSelectedNodeData.jobName);
    this.job = {
      "id": 0,
      "jobName": "",
      "machineId": this.treeSelectedNodeData.machineId,
      "jobSequenceNo": 0,
      "jobDescription": "",
      "parentJobId": this.treeSelectedNodeData.id,
      "durationInMins": 0
    }
    this.getMachine();
    this.machine.disable();
    
  }

  deleteJob() {
    this.disableDeleteButton = false;
    this.form.reset();
    this.formHidden = true;
    this.jobService.deleteJob(this.job.id);
    this.getAllJobs();

  }

  saveForm() {
    if (this.job.parentJobId != 0) {


    }
  }

  cancelForm() {
    this.formHidden = true;
  }

  get jobName() { return this.form.get("jobName"); }
  get machine() { return this.form.get("machine"); }
  get jobSequenceNo() { return this.form.get("jobSequenceNo"); }
  get jobDescription() { return this.form.get("jobDescription"); }
  get parentJob() { return this.form.get("parentJob"); }
  get parentJobId() { return this.form.get("parentJobId"); }
  get durationInMins() { return this.form.get("durationInMins"); }
  get designations(){return this.form.get('designations') as FormArray;}

  clickNode(selectedNode) {
    this.disableDeleteButton = false;
    this.treeSelectedNodeData = selectedNode.node.data;
    this.treeSelectedNode = selectedNode.node;
    this.job.id = this.treeSelectedNodeData.id;
    this.job.jobName = this.treeSelectedNodeData.jobName;
    this.job.jobDescription = this.treeSelectedNodeData.jobDescription;
    this.job.jobSequenceNo = this.treeSelectedNodeData.jobSequenceNo;
    this.job.machineId = this.treeSelectedNodeData.machineId;
    this.job.durationInMins = this.treeSelectedNodeData.durationInMins;
    this.job.parentJobId = this.treeSelectedNodeData.parentJobId;
    if (this.job.parentJobId != 0) {
      this.parentJob.setValue(selectedNode.node.parent.data.jobName);
      this.machine.disable();
      this.disableNewChildJobButton = true; 
    }
    else {
      this.disableNewChildJobButton = false;
      this.parentJob.setValue("");
      this.machine.enable();
    }
    if (this.job.machineId > 0) this.getMachine();


    this.getJobDesignations();

    this.formHidden = false;
  }

  getJobDesignations(){
    this.jobService.getJobDesignations(this.job.id).subscribe(
      designationData => {
        //console.log(designationData);
        this.jobDesignations = designationData;
      }, error => this.errorMessage = <any>error,
      ()=>{
        //console.log(this.form.value.designations[0].Accountant);
        //this.form.value.designations[0].Accountant = true;
        //this.designations.controls[1].setValue({"Head Fitter":true});
        //console.log(this.designations.controls[1].value);


        //Clear all check boxes
        for (let control of this.designations.controls){
          let keyName = (Object.keys(control.value))[0];
          control.setValue({[keyName]:false});
        }

        //Set the value of checkboxes to true for corresponding designation
        for (let position of this.jobDesignations){
          let desigName = this.getDesignationNameFromId(position.designationId); 
          for (let control of this.designations.controls){
            //console.log(Object.keys(control.value));
            if(control.value.hasOwnProperty(desigName)){
              control.setValue({[desigName]:true});
            }
          
          }
        }
      }
    )
  }

  getDesignationNameFromId(id:number){
    let ar:IDesignation[]= this.designationList.filter(x=>x.id == id);
    if (ar.length > 0){
      return ar[0].title;
    }
    else
      return "";
  }
}
