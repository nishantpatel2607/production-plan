import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IVMWorkOrderListItem, IVMWorkOrder } from '../../model/viewModel/workorderModels/vmWorkOrder';
import { IWorkOrder } from '../../model/workOrder';
import { IVMWorkOrderSuitableEmployee } from '../../model/viewModel/workorderModels/vmWorkOrderSuitableEmployee';


@Injectable()
export class WorkOrderService{
    private workOrderListUrl = "./assets/workorderlist.json"; 
    private workOrders = "./assets/workorder.json"; 
    private workOrderSuitableEmployees = "./assets/workOrderSuitableEmployees.json"

    constructor(private _http: Http){}

    getWorkOrderList():Observable<IVMWorkOrderListItem[]>{
        return this._http.get(this.workOrderListUrl)
        .map((response: Response) => <IVMWorkOrderListItem[]> response.json())
        //.do(data => console.log('MAC: ' + JSON.stringify(data)))
        .catch(this.handleError);
    }

    getWorkOrder(id:number):Observable<IVMWorkOrder>{
        let workOrder: Observable<IVMWorkOrder>;
        workOrder = (this._http.get(this.workOrders)
        .map((response:Response) => <IVMWorkOrder[]> response.json()))
        .map((workorders:IVMWorkOrder[]) => workorders.find(wo => wo.id == id))
        .catch(this.handleError);
        return workOrder;
    }


    //get the list of employees suitable to workorder.
    //At serverside write the query based on machine or assembly
    getSuitableEmployees(id:number): Observable<IVMWorkOrderSuitableEmployee[]>{
        return this._http.get(this.workOrderSuitableEmployees)
        .map((response: Response) => <IVMWorkOrderSuitableEmployee[]> response.json())
        //.do(data => console.log('MAC: ' + JSON.stringify(data)))
        .catch(this.handleError);  
    }

    private handleError(error: Response) {
        console.error(error);
       return Observable.throw(error.json().error || 'Server error');
   }
}