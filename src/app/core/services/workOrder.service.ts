import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IWorkOrder } from '../../model/orderMaster';
import { IWorkOrderProject } from '../../model/orderProject';

@Injectable()
export class WorkOrderService {
    private _workOrdersUrl = './assets/orders.json';
    private _workOrderProjectsUrl = './assets/orderProjects.json';
    

    constructor(private _http: Http){}

    // Get all orders based on order status
    //ToDo : call the api to get orders based on order status  
    //Use join query to get the jobId of top job
    getOrdersByStatus(OrderStatus:number): Observable<IWorkOrder[]>{
        return this._http.get(this._workOrdersUrl)
        .map((response: Response) => <IWorkOrder[]> response.json())
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

    //Use join query to get the jobId of top job
    getAllOrders(): Observable<IWorkOrder[]>{
        return this._http.get(this._workOrdersUrl)
        .map((response: Response) => <IWorkOrder[]> response.json())
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

      //get order by Id
      getOrder(id: number) :Observable<IWorkOrder> {
        let order: Observable<IWorkOrder>;
        order= this.getAllOrders()
        .map((orders: IWorkOrder[])=> orders.find(o => o.id === id))
        //.do(data => console.log('MAC: ' + JSON.stringify(data))) 
        return order;
    }

    //get list of all projects of a order. 
    //Use joins to get job name and  array of job designations name along with job id, in query
    getOrderProjects(id:number) :Observable<IWorkOrderProject[]>{
        return this._http.get(this._workOrderProjectsUrl)
        .map((response: Response) => <IWorkOrderProject[]> response.json())
        .do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}