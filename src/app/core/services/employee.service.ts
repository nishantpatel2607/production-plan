
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { IEmployee } from '../../model/employee';
import { HttpClient } from '@angular/common/http';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';
import { AppError } from '../../errorhandlers/app-error';





@Injectable() 
export class EmployeeService{
    private _employeesUrl = "./assets/employees.json"; 
    
    constructor(private _http: HttpClient){}

    //Get all employees - join query to get designation names
    getEmployees(): Observable<IEmployee[]>{
        return this._http.get(this._employeesUrl)
        //.map((response: Response) => <IEmployee[]> response.json())
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError); 
    }

    //get employee by Id - join query to get designation name
    getEmployee(id: number) :Observable<IEmployee> {
        let employee: Observable<IEmployee>;
        employee= this.getEmployees()
        .map((employees: IEmployee[])=> employees.find(m => m.id === id))
        //.do(data => console.log('MAC: ' + JSON.stringify(data)))
        return employee;
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
}