import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IDesignation } from '../../model/designation';

@Injectable()
export class DesignationService {

    private _designationsUrl = "./assets/designations.json";

    constructor(private _http: Http) { }

    //Get all employees
    getDesignations(): Observable<IDesignation[]> {
        return this._http.get(this._designationsUrl)
            .map((response: Response) => <IDesignation[]>response.json())
            //.do(data => console.log('All: ' + JSON.stringify(data)))
            .catch(this.handleError);
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