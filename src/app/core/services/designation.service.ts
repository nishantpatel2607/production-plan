import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IDesignation } from '../../model/designation';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DesignationService { 

    private _designationsUrl = "./assets/designations.json";

    constructor(private _http: HttpClient) { } 

    //Get all designations
    getDesignations(): Observable<IDesignation[]> {
        return this._http.get(this._designationsUrl)
            
            //.do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    //Get a designation
    getDesignation(id:number): Observable<IDesignation> {
        let designation : Observable<IDesignation>;
        designation = this.getDesignations()
        .map((designations:IDesignation[])=>designations.find(d => d.id == id))
        .catch(this.handleError);
        return designation;
        
    }

    createDesignation(newDesignation: IDesignation) {

    }

    updateDesignation(designation: IDesignation) {

    }

    deleteDesignation(id: number) { }

    private handleError(error: Response) {

        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}