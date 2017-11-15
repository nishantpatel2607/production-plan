
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { IMachineModel } from '../../model/machineModel';


@Injectable()
export class MachineModelService{
    private _machineModelUrl = "./assets/machineModels.json"; 
    
    constructor(private _http: Http){}

    //get Models by specified category Id
    getMachineModelsByCategory(id: number): Observable<IMachineModel[]>{
        return this._http.get(this._machineModelUrl)
        .map((response: Response) => (<IMachineModel[]> response.json())
        .find(m => m.categoryId === id))
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

    //get Model by specified Id
    getMachineModel(id: number) :Observable<IMachineModel> {
        return this._http.get(this._machineModelUrl)
        .map((response: Response) => (<IMachineModel[]> response.json())
        .find(m => m.id === id))
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}