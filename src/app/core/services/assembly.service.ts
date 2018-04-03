import { observable } from 'rxjs/symbol/observable';
import { Injectable } from '@angular/core';
import { Response,Http, RequestOptions, RequestMethod, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import {IAssembly} from "../../model/assembly";
import {IAssemblyDesignation} from "../../model/assemblyDesignations";
import { IDesignation } from '../../model/designation';
import { IVMAssembly, IVMAssemblyListItem } from '../../model/viewModel/assemblyViewModels/vmAssembly';
import { HttpClient } from '@angular/common/http';
import { NotFoundError } from '../../errorhandlers/not-found-error';
import { BadRequestError } from '../../errorhandlers/bad-request-error';
import { AppError } from '../../errorhandlers/app-error';
import { IResponse } from './IResponse';
import { Global } from './global';


@Injectable()
export class AssemblyService{
    private _assemblyUrl = "./assets/assemblies.json";
    private _assemblyListUrl = "./assets/assemblyList.json";
    private _assemblyDesignationUrl = "./assets/assemblyDesignations.json";
    private _vmAssemblyUrl = "./assets/vmAssemblies.json";
    private _topAssemblyUrl="";
 
    constructor(private _http: Http){}


    //get the list of assemblies
    getAssemblies():Observable<IResponse>{
        return this._http.get(Global.apiUrl + "getAssemblies")
            .map((response: Response) => <IResponse>response.json())
            //.do(data => console.log(data.data))
            .catch(this.handleError);
    }


    //get the list of assemblies (id and assembly name only)
    //IVMAssemblyListItem[]
    getAssemblyList():Observable<IResponse>{
        return this._http.get(Global.apiUrl + "getAssemblylist")
        .map((response: Response) => <IResponse>response.json())
        //.do(data => console.log(data.data))
        .catch(this.handleError);
    }

    //get the list of designations suitable for supplied assembly
    /* getAssemblyDesignations(assemblyId:number):Observable<IAssemblyDesignation[]>{
        return this._http.get(this._assemblyDesignationUrl)
        
        .map((response: Response) => (<IAssemblyDesignation[]> response.json())
        .filter(response => response.assemblyId == assemblyId))
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError); 
    } */

    //get the list of top level assemblies
    /* getTopLevelAssemblies():Observable<IAssembly[]>{
        return this._http.get(this._topAssemblyUrl)
        //.map((response: Response) => (<IAssembly[]> response.json()))
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    } */

    //get assembly by Id
    //IVMAssembly
    getAssembly(id: number): Observable<IResponse>{
        return this._http.get(Global.apiUrl + "Assembly/" + id)
        .map((response: Response) => <IResponse>response.json())
        //.do(data => console.log(data.data))
        .catch(this.handleError);
    }

    //create new assembly 
    createAssembly(assembly:IVMAssembly) : Observable<IResponse>{
        const options = this.GetOptions();
        let body = JSON.stringify(assembly);
        return this._http.post(Global.apiUrl + "assembly",body,options)
            .map((response: Response) => <IResponse>response.json())
            //.do(data => console.log(data.data))
            .catch(this.handleError);
    }

    //update existing Assembly
    updateAssembly(assembly:IVMAssembly) : Observable<IResponse> {
        const options = this.GetOptions();
        let body = JSON.stringify(assembly);
        return this._http.put(Global.apiUrl + "assembly",body,options)
            .map((response: Response) => <IResponse>response.json())
            //.do(data => console.log(data.data))
            .catch(this.handleError);
    }

    //delete existing Assembly
    deleteAssembly(assemblyId:number) : Observable<IResponse> {
        const options = this.GetOptions();
        return this._http.delete(Global.apiUrl + "assembly/" + assemblyId,options)
            .map((response: Response) => <IResponse>response.json())
            .do(data => console.log(data))
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