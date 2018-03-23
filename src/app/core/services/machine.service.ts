import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';

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

@Injectable()
export class MachineService{
    private _machineUrl = "./assets/machines.json"; 
    private _vmMachineUrl = "./assets/vmMachines.json"; 
    private _machineDesignationUrl = "./assets/machineDesignations.json"; 
    private _machineListUrl = "./assets/machinesList.json"; 
    
    constructor(private _http: Http){}

    //get all machines
    getMachines(): Observable<IMachine[]>{
        return this._http.get(this._machineUrl)
        .map((response: Response) => <IMachine[]> response.json())
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

    //get all machines
    getMachineList(): Observable<IVMMachineListItem[]>{
        return this._http.get(this._machineListUrl)
        .map((response: Response) => <IVMMachineListItem[]> response.json())
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }
    

    //get machine by Id
    getMachine(id: number) :Observable<IVMMachine> {
        let machine: Observable<IVMMachine>; 
        machine= (this._http.get(this._vmMachineUrl)
        .map((response: Response) => <IVMMachine[]> response.json()))
        .map((machines: IVMMachine[])=> machines.find(m => m.id === id))
        //.do(data => console.log('MAC: ' + JSON.stringify(data)))
        return machine;
    }

    //get the list of designations suitable for supplied assembly
    getMachineDesignations(machineId:number):Observable<IMachineDesignation[]>{
        return this._http.get(this._machineDesignationUrl)
        .map((response: Response) => (<IMachineDesignation[]> response.json())
        .filter(response => response.machineId == machineId))
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError); 
    }

    

    createMachine(machine:IVMMachine){}

    updateMachine(machine:IVMMachine){}

    deleteMachine(id: number){}

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