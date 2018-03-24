import { Injectable } from '@angular/core';
import { Response,Http, RequestOptions, RequestMethod, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IDesignation } from '../../model/designation';

import { NotFoundError } from '../../errorhandlers/not-found-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';
import { AppError } from '../../errorhandlers/app-error';
import { IResponse } from './IResponse';
import { Global } from './global';

@Injectable()
export class DesignationService { 

    private _designationsUrl = "./assets/designations.json";

    constructor(private _http: Http) { } 

    //Get all designations
    getDesignations(): Observable<IResponse> {
        
        return this._http.get(Global.apiUrl + "getDesignations")
            .map((response: Response) => <IResponse>response.json())
            //.do(data => console.log(data.data))
            .catch(this.handleError);
    }

    //Get a designation
    /* getDesignation(id:number): Observable<IDesignation> {
        let designation : Observable<IDesignation>;
        designation = this.getDesignations()
        .map((designations:IDesignation[])=>designations.find(d => d.id == id))
        .catch(this.handleError);
        return designation;
        
    } */

    createDesignation(newDesignation: IDesignation): Observable<IResponse> {
        //let headers =  {headers: new  Headers({ 'Content-Type': 'application/json'})};
        //let options = new RequestOptions(); 
        //options.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
        //options.headers = new Headers({ 'Content-Type': 'application/json'});
        const options = this.GetOptions();
        
        
        //let body = this.serializeObj(newDesignation);
        let body = JSON.stringify(newDesignation);
        return this._http.post(Global.apiUrl + "postdesignation",body,options)
            .map((response: Response) => <IResponse>response.json())
            .do(data => console.log(data.data))
            .catch(this.handleError);
    }

    private serializeObj(obj) {
        var result = [];
        for (var property in obj)
            result.push(encodeURIComponent(property) + "=" + encodeURIComponent(obj[property]));
    
        return result.join("&");
    }

    updateDesignation(designation: IDesignation) {

    }

    deleteDesignation(id: number) { }

    private handleError(error: Response) {
        if (error.status === 404) {
            return Observable.throw(new NotFoundError());
        }
        if (error.status === 400) {
            return Observable.throw(new BadRequestError(error.json()));
        }
        console.log("Error: " + error);
        return Observable.throw(new AppError(error));
    }


    private GetOptions(): RequestOptions {
        
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return new RequestOptions({ headers: headers });
      }
}