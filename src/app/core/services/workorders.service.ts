import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { IVMWorkOrderListItem, IVMWorkOrder } from '../../model/viewModel/workorderModels/vmWorkOrder';
import { IWorkOrder } from '../../model/workOrder';
import { IVMWorkOrderSuitableEmployee } from '../../model/viewModel/workorderModels/vmWorkOrderSuitableEmployee';
import { IVMWorkOrderTeam } from '../../model/viewModel/workorderModels/vmWorkOrderTeam';
import { IVMWorkOrderPlan } from '../../model/viewModel/workorderModels/vmWorkOrderPlan';
import { HttpClient } from '@angular/common/http';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';
import { AppError } from '../../errorhandlers/app-error';


@Injectable()
export class WorkOrderService{
    private workOrderListUrl = "./assets/workorderlist.json"; 
    private workOrders = "./assets/workorder.json"; 
    private workOrderSuitableEmployees = "./assets/workOrderSuitableEmployees.json"
    private workOrderTeamMembers = "./assets/workOrderTeamMembers.json"
    private workOrderPlan="./assets/vmworkorderPlan.json";

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

    //get workorder team members.
    getTeamMembers(id:number): Observable<IVMWorkOrderTeam[]>{
        return this._http.get(this.workOrderTeamMembers)
        .map((response: Response) => <IVMWorkOrderTeam[]> response.json())
        //.do(data => console.log('MAC: ' + JSON.stringify(data)))
        .catch(this.handleError);  
    }

    saveTeamMembers(teamMembers:IVMWorkOrderTeam[]){
        
        
    }

    //get the work orders planned between the given dates 
    getWorkOrderPlan(startDate: string, endDate: string): Observable<IVMWorkOrderPlan[]>{
        return this._http.get(this.workOrderPlan)
        .map((response: Response) => <IVMWorkOrderPlan[]> response.json())
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
}