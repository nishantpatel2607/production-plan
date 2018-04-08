
import { Injectable } from '@angular/core';
import { Response,Http, RequestOptions, RequestMethod, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { IEmployee } from '../../model/employee';
//import { HttpClient } from '@angular/common/http';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';
import { AppError } from '../../errorhandlers/app-error';
import { IResponse } from './IResponse';
import { Global } from './global';

@Injectable()
export class EmployeeService {
    

    constructor(private _http: Http) { }

    //Get all employees - join query to get designation names
    getEmployees(): Observable<IResponse> {
        return this._http.get(Global.apiUrl + "getEmployeesNoUsername")
            .map((response: Response) => <IResponse>response.json())
            //.do(data => console.log(data.data))
            .catch(this.handleError);
    }

    //get employee by Id - join query to get designation name
    getEmployee(id: number): Observable<IResponse> {
        return this._http.get(Global.apiUrl + "Employees/" + id)
            .map((response: Response) => <IResponse>response.json())
            //.do(data => console.log(data.data))
            .catch(this.handleError);
    }

    deleteEmployee(id: number) : Observable<IResponse>{
        const options = this.GetOptions();
        return this._http.delete(Global.apiUrl + "employees/" + id,options)
            .map((response: Response) => <IResponse>response.json())
            .do(data => console.log(data))
            .catch(this.handleError);
     }

     createEmployee(employee: IEmployee): Observable<IResponse> {
        const options = this.GetOptions();
        let body = JSON.stringify(employee);
        return this._http.post(Global.apiUrl + "Employees",body,options)
            .map((response: Response) => <IResponse>response.json())
            //.do(data => console.log(data.data))
            .catch(this.handleError);
    }

    updateEmployee(employee: IEmployee) : Observable<IResponse> {
        const options = this.GetOptions();
        let body = JSON.stringify(employee);
        return this._http.put(Global.apiUrl + "employees/" + employee.id,body,options)
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