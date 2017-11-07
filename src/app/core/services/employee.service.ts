
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { IEmployee } from '../../model/employee';





@Injectable()
export class EmployeeService{
    private _employeesUrl = "./assets/employees.json"; 
    
    constructor(private _http: Http){}

    getEmployees(): Observable<IEmployee[]>{
        return this._http.get(this._employeesUrl)
        .map((response: Response) => <IEmployee[]> response.json())
        .do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

    

    private handleError(error: Response) {
        
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}