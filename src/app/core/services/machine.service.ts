import { Injectable } from '@angular/core';
import { Response,Http, RequestOptions, RequestMethod, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import {IMachine} from "../../model/machine";
import { IVMMachine, IVMMachineListItem } from '../../model/viewModel/machineViewModels/vmMachine';
import { IMachineDesignation } from '../../model/machineDesignation';
import { HttpClient } from '@angular/common/http';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';
import { AppError } from '../../errorhandlers/app-error';
import { IResponse } from './IResponse';
import { Global } from './global';

@Injectable()
export class MachineService{
    private _machineUrl = "./assets/machines.json"; 
    private _vmMachineUrl = "./assets/vmMachines.json"; 
    private _machineDesignationUrl = "./assets/machineDesignations.json"; 
    private _machineListUrl = "./assets/machinesList.json"; 
    
    constructor(private _http: Http){} 

    //get all machines
    //IVMMachine[]
    getMachines(): Observable<IResponse>{
        return this._http.get(Global.apiUrl + "machines")
        .map((response: Response) => <IResponse>response.json())
        .catch(this.handleError);
    }
 
    //get all machines
    //IVMMachineListItem[]
    getMachineList(): Observable<IResponse>{
        return this._http.get(Global.apiUrl + "machines/list")
        .map((response: Response) => <IResponse>response.json())
        .catch(this.handleError);
    }
    

    //get machine by Id
    getMachine(id: number) :Observable<IResponse> {
        return this._http.get(Global.apiUrl + "machines/" + id)
        .map((response: Response) => <IResponse>response.json())
        .catch(this.handleError);
    }

      

    createMachine(machine:IVMMachine) :Observable<IResponse>{
        const options = this.GetOptions();
        let body = JSON.stringify(machine);
        return this._http.post(Global.apiUrl + "machines",body,options)
            .map((response: Response) => <IResponse>response.json())
            //.do(data => console.log(data.data))
            .catch(this.handleError);
    }

    updateMachine(machine:IVMMachine) :Observable<IResponse>{
        const options = this.GetOptions();
        let body = JSON.stringify(machine);
        return this._http.put(Global.apiUrl + "machines",body,options)
            .map((response: Response) => <IResponse>response.json())
            //.do(data => console.log(data.data))
            .catch(this.handleError);
    }

    deleteMachine(id: number) :Observable<IResponse> {
        const options = this.GetOptions();
        return this._http.delete(Global.apiUrl + "machines/" + id,options)
            .map((response: Response) => <IResponse>response.json())
            .do(data => console.log(data))
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        if (error.status === 404) {
            return Observable.throw(new NotFoundError());
        }
        if (error.status === 400) {
            return Observable.throw(new BadRequestError(error.json()));
        }

        return Observable.throw(new AppError(error));
    }

    private GetOptions(): RequestOptions {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return new RequestOptions({ headers: headers });
    }
}