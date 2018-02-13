import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import {IMachine} from "../../model/machine";
import { IVMMachine } from '../../model/viewModel/machineViewModels/vmMachine';

@Injectable()
export class MachineService{
    private _machineUrl = "./assets/machines.json"; 
    private _vmMachineUrl = "./assets/vmMachines.json"; 
    
    constructor(private _http: Http){}

    //get all machines
    getMachines(): Observable<IMachine[]>{
        return this._http.get(this._machineUrl)
        .map((response: Response) => <IMachine[]> response.json())
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

    createMachine(machine:IVMMachine){}

    updateMachine(machine:IVMMachine){}

    deleteMachine(id: number){}

    private handleError(error: Response) {
        
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}