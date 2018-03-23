import { observable } from 'rxjs/symbol/observable';
import { Injectable } from '@angular/core';
import { Response} from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import {IJob} from "../../model/job";
import {IJobDesignations} from "../../model/jobDesignations";
import { IDesignation } from '../../model/designation';
import { HttpClient } from '@angular/common/http';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';
import { AppError } from '../../errorhandlers/app-error';

@Injectable()
export class JobService{
    private _jobUrl = "./assets/jobs.json";
    private _JobDesignationUrl = "./assets/jobDesignations.json";

    constructor(private _http: HttpClient){}
    
    //get the list of jobs
    getJobs():Observable<IJob[]>{
        return this._http.get(this._jobUrl)
        .map((response: Response) => <IJob[]> response.json())
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
        
    }

    //get the list of designations suitable for supplied job
    getJobDesignations(jobId:number):Observable<IJobDesignations[]>{
        return this._http.get(this._JobDesignationUrl)
        .map((response: Response) => (<IJobDesignations[]> response.json())
        .filter(response => response.jobId == jobId))
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError); 
    }

    //get the list of top level jobs
    getTopLevelJobs():Observable<IJob[]>{
        return this._http.get(this._jobUrl)
        .map((response: Response) => (<IJob[]> response.json())
        .filter(response => response.parentJobId == 0))
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

    //get job by Id
    getJob(id: number): Observable<IJob>{
        let job: Observable<IJob>;
        job= this.getJobs().map((jobs: IJob[])=> jobs.find(j => j.id === id));
        return job;
    }


    //create new job 
    createJob(){

    }

    //update existing job
    updateJob(){}

    //delete existing job
    deleteJob(jobId:number){}

    //add designation 
    addJobDesignation(){}

    //delete designation from job
    deleteJobDesignation(){}

    private handleError(error: Response) {
        if (error.status === 404) {
            return Observable.throw(new NotFoundError());
        }
        if (error.status === 400) {
            return Observable.throw(new BadRequestError(error.json()));
        }

        return Observable.throw(new AppError(error));
    }

}