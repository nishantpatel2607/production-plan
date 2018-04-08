
import { Injectable } from '@angular/core';
import { Response,Http, RequestOptions, RequestMethod, Headers } from '@angular/http';

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
import { IResponse } from './IResponse';
import { Global } from './global';

@Injectable()
export class MachineCategoryService{
    private _machineCategoryUrl = "./assets/machineCategories.json"; 
    
    constructor(private _http: Http){}

    //get all categories
    getMachineCategories(): Observable<IResponse>{
        return this._http.get(Global.apiUrl + "MachineCategories")
        .map((response: Response) => <IResponse>response.json())
        .catch(this.handleError);
    }

    //get machine category based on Id
    getMachineCategory(id: number) :Observable<IResponse> {
        return this._http.get(Global.apiUrl + "MachineCategories/" + id)
        .map((response: Response) => <IResponse>response.json())
        .catch(this.handleError);
    }

    createMachineCategory(newMachineCategory:IMachineCategory) : Observable<IResponse> {
        const options = this.GetOptions();
        let body = JSON.stringify(newMachineCategory);
        return this._http.post(Global.apiUrl + "MachineCategories",body,options)
            .map((response: Response) => <IResponse>response.json())
            //.do(data => console.log(data.data))
            .catch(this.handleError);
    }

    updateMachineCategory(machineCategory:IMachineCategory) : Observable<IResponse>{
        const options = this.GetOptions();
        let body = JSON.stringify(machineCategory);
        return this._http.put(Global.apiUrl + "MachineCategories/" + machineCategory.id,body,options)
            .map((response: Response) => <IResponse>response.json())
            .do(data => console.log(data))
            .catch(this.handleError);
    }

    deleteMachineCategory(id:number) : Observable<IResponse>{
        const options = this.GetOptions();
        return this._http.delete(Global.apiUrl + "MachineCategories/" + id,options)
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