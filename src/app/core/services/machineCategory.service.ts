
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IMachineCategory } from '../../model/machineCategory';


@Injectable()
export class MachineCategoryService{
    private _machineCategoryUrl = "./assets/machineCategories.json"; 
    
    constructor(private _http: Http){}

    //get all categories
    getMachineCategories(): Observable<IMachineCategory[]>{
        return this._http.get(this._machineCategoryUrl)
        .map((response: Response) => <IMachineCategory[]> response.json())
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError); 
    }

    //get machine category based on Id
    getMachineCategory(id: number) :Observable<IMachineCategory> {
        let machine: Observable<IMachineCategory>;
        machine= this.getMachineCategories()
        .map((machineCategories: IMachineCategory[])=> machineCategories.find(m => m.id === id))
        //.do(data => console.log('MAC: ' + JSON.stringify(data)))
        return machine;
    }

    createMachineCategory(newMachineCategory:IMachineCategory){

    }

    updateMachineCategory(machineCategory:IMachineCategory){

    }

    deleteMachineCategory(id:number){}

    private handleError(error: Response) {
        
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}