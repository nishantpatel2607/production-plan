import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IOrder } from '../../model/orderMaster';
import { IOrderProject } from '../../model/orderProject';

@Injectable()
export class OrderService {
    private _ordersUrl = './assets/orders.json';
    private _orderProjectsUrl = './assets/orderProjects.json';
    

    constructor(private _http: Http){}

    // Get all orders based on order status
    //ToDo : call the api to get orders based on order status  
    //Use join query to get the jobId of top job
    getOrdersByStatus(OrderStatus:number): Observable<IOrder[]>{
        return this._http.get(this._ordersUrl)
        .map((response: Response) => <IOrder[]> response.json())
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

    //Use join query to get the jobId of top job
    getAllOrders(): Observable<IOrder[]>{
        return this._http.get(this._ordersUrl)
        .map((response: Response) => <IOrder[]> response.json())
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

      //get order by Id
      getOrder(id: number) :Observable<IOrder> {
        let order: Observable<IOrder>;
        order= this.getAllOrders()
        .map((orders: IOrder[])=> orders.find(o => o.id === id))
        .do(data => console.log('MAC: ' + JSON.stringify(data)))
        return order;
    }

    //get list of all projects of a order. 
    //Use joins to get job name along with job id, in query
    getOrderProjects(id:number) :Observable<IOrderProject[]>{
        return this._http.get(this._orderProjectsUrl)
        .map((response: Response) => <IOrderProject[]> response.json())
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}