import { IJob } from '../../model/job';
import { Component, OnInit } from '@angular/core';
import { TREE_ACTIONS, IActionMapping } from 'angular-tree-component';
import { JobService } from '../../core/services/job.service';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css']
})
export class JobFormComponent implements OnInit {

  /* nodes = [ 
    {
      id: 1,
      name: 'root1',
      children: [
        { id: 2, name: 'child1' },
        { id: 3, name: 'child2' }
      ]
    },
    {
      id: 4,
      name: 'root2',
      children: [
        { id: 5, name: 'child2.1' },
        {
          id: 6,
          name: 'child2.2',
          children: [
            { id: 7, name: 'subsub' }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'root2',
      children: [
        { id: 5, name: 'child2.1' },
        {
          id: 6,
          name: 'child2.2',
          children: [
            { id: 7, name: 'subsub' }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'root2',
      children: [
        { id: 5, name: 'child2.1' },
        {
          id: 6,
          name: 'child2.2',
          children: [
            { id: 7, name: 'subsub' }
          ]
        }
      ]
    },
    {
      id: 4,
      name: 'root2',
      children: [
        { id: 5, name: 'child2.1' },
        {
          id: 6,
          name: 'child2.2',
          children: [
            { id: 7, name: 'subsub' }
          ]
        }
      ]
    }
  ]; */
  nodes;
  jobs: IJob[];
  errorMessage: string;

  constructor(private jobService: JobService) {

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
}
