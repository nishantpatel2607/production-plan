import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IOrder } from '../../model/orderMaster';

@Injectable()
export class OrderService {
    private _ordersUrl = './assets/orders.json';

    constructor(private _http: Http){}

    // Get all orders based on order status
    //ToDo : call the api to get orders based on order status 
    getOrders(OrderStatus:number): Observable<IOrder[]>{
        return this._http.get(this._ordersUrl)
        .map((response: Response) => <IOrder[]> response.json())
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

    
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
        //.do(data => console.log('MAC: ' + JSON.stringify(data)))
        return order;
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}