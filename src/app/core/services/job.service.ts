import { observable } from 'rxjs/symbol/observable';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import {IJob} from "../../model/job";
import {IJobDesignations} from "../../model/jobDesignations";
import { IDesignation } from '../../model/designation';

@Injectable()
export class JobService{
    private _jobUrl = "./assets/jobs.json";
    private _JobDesignationUrl = "./assets/jobDesignations.json";

    constructor(private _http: Http){}
    
    //get the list of jobs
    getJobs():Observable<IJob[]>{
        return this._http.get(this._jobUrl)
        .map((response: Response) => <IJob[]> response.json())
        .do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
        
    }

    //get the list of designations suitable for supplied job
    getJobDesignations(jobId:number):Observable<IJobDesignations[]>{
        return this._http.get(this._JobDesignationUrl)
        .map((response: Response) => <IJobDesignations[]> response.json())
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

    
    //create new job 
    createJob(){

    }

    //update existing job
    updateJob(){}

    //delete existing job
    deleteJob(){}

    //add designation 
    addJobDesignation(){}

    //delete designation from job
    deleteJobDesignation(){}

    private handleError(error: Response) {
        
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

}