import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IVMWorkOrderListItem } from '../../model/viewModel/workorderModels/vmWorkOrder';


@Injectable()
export class WorkOrderService{
    private workOrderListUrl = "./assets/workorderlist.json"; 

    constructor(private _http: Http){}

    getWorkOrderList():Observable<IVMWorkOrderListItem[]>{
        return this._http.get(this.workOrderListUrl)
        .map((response: Response) => <IVMWorkOrderListItem[]> response.json())
        .do(data => console.log('MAC: ' + JSON.stringify(data)))
        .catch(this.handleError);
    }


    private handleError(error: Response) {
        console.error(error);
       return Observable.throw(error.json().error || 'Server error');
   }
}