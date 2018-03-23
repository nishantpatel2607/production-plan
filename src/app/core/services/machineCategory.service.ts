
import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IMachineCategory } from '../../model/machineCategory';
import { HttpClient } from '@angular/common/http';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';
import { AppError } from '../../errorhandlers/app-error';


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
        if (error.status === 404) {
            return Observable.throw(new NotFoundError());
        }
        if (error.status === 400) {
            return Observable.throw(new BadRequestError(error.json()));
        }

        return Observable.throw(new AppError(error));
    }
}