import { Injectable } from '@angular/core';
import { Response,Http, RequestOptions, RequestMethod, Headers } from '@angular/http';

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
import { IResponse } from './IResponse';
import { Global } from './global';

@Injectable()
export class WorkOrderService{
    private workOrderListUrl = "./assets/workorderlist.json"; 
    private workOrders = "./assets/workorder.json"; 
    private workOrderSuitableEmployees = "./assets/workOrderSuitableEmployees.json"
    private workOrderTeamMembers = "./assets/workOrderTeamMembers.json"
    private workOrderPlan="./assets/vmworkorderPlan.json";

    constructor(private _http: Http){}

    //IVMWorkOrderListItem[]
    getWorkOrderList():Observable<IResponse>{
        return this._http.get(Global.apiUrl + "Workorders/list")
        .map((response: Response) => <IResponse>response.json())
        .catch(this.handleError);
    }

    //IVMWorkOrder
    getWorkOrder(workorderid:number):Observable<IResponse>{
        return this._http.get(Global.apiUrl + "Workorders/getworkorder/" + workorderid)
        .map((response: Response) => <IResponse>response.json())
        .catch(this.handleError);
    }

    deleteWorkOrder(workorderid:number):Observable<IResponse>{
        const options = this.GetOptions();
        return this._http.delete(Global.apiUrl + "Workorders/" + workorderid,options)
        .map((response: Response) => <IResponse>response.json())
        .catch(this.handleError);
    }

    //get the list of employees suitable to workorder.
    //IVMWorkOrderSuitableEmployee[]
    getSuitableEmployees(id:number): Observable<IResponse>{
        return this._http.get(Global.apiUrl + "Workorders/suitableemployees/" + id)
        .map((response: Response) => <IResponse>response.json())
        //.do(data => console.log('MAC: ' + JSON.stringify(data)))
        .catch(this.handleError);   
    }

    //get workorder team members.
    //IVMWorkOrderTeam[]
    getTeamMembers(id:number): Observable<IResponse>{
        return this._http.get(Global.apiUrl + "Workorders/team/" + id)
        .map((response: Response) => <IResponse>response.json())
        //.do(data => console.log('MAC: ' + JSON.stringify(data)))
        .catch(this.handleError);  
    }


    createWorkorder(workorder:IVMWorkOrder) :Observable<IResponse>{
        const options = this.GetOptions();
        let body = JSON.stringify(workorder);
        return this._http.post(Global.apiUrl + "workorders",body,options)
            .map((response: Response) => <IResponse>response.json())
            //.do(data => console.log(data.data))
            .catch(this.handleError);
    }

    updateWorkorder(workorder:IVMWorkOrder) :Observable<IResponse>{
        const options = this.GetOptions();
        let body = JSON.stringify(workorder);
        return this._http.put(Global.apiUrl + "workorders",body,options)
            .map((response: Response) => <IResponse>response.json())
            //.do(data => console.log(data.data))
            .catch(this.handleError);
    }

    saveTeamMembers(teamMembers:IVMWorkOrderTeam[]):Observable<IResponse>{
        const options = this.GetOptions();
        let body = JSON.stringify(teamMembers);
        
        return this._http.post(Global.apiUrl + "workorders/addteam",body,options)
            .map((response: Response) => <IResponse>response.json())
            //.do(data => console.log(data.data))
            .catch(this.handleError);
        
    }

    addWorkorderPlan(woPlan: IVMWorkOrderPlan) : Observable<IResponse> {
        const options = this.GetOptions();
        let body = JSON.stringify(woPlan);
        return this._http.post(Global.apiUrl + "workorders/addplan",body,options)
            .map((response: Response) => <IResponse>response.json())
            //.do(data => console.log(data.data))
            .catch(this.handleError);
    }

    updateWorkorderPlan(woPlan: IVMWorkOrderPlan) : Observable<IResponse> {
        const options = this.GetOptions();
        let body = JSON.stringify(woPlan);
        return this._http.put(Global.apiUrl + "workorders/editplan",body,options)
            .map((response: Response) => <IResponse>response.json())
            //.do(data => console.log(data.data))
            .catch(this.handleError);
    }

    //get the work orders planned between the given dates 
    //IVMWorkOrderPlan[]
    getWorkOrderPlan(startDate: string, endDate: string): Observable<IResponse>{
        return this._http.get(Global.apiUrl + "Workorders/plansindaterange?DateFrom="+startDate+"&DateTo=" + endDate ,)
        .map((response: Response) => <IResponse>response.json())
        //.do(data => console.log('MAC: ' + JSON.stringify(data)))
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