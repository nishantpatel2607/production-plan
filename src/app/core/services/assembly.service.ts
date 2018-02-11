import { observable } from 'rxjs/symbol/observable';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import {IAssembly} from "../../model/assembly";
import {IAssemblyDesignation} from "../../model/assemblyDesignations";
import { IDesignation } from '../../model/designation';

@Injectable()
export class AssemblyService{
    private _assemblyUrl = "./assets/assemblies.json";
    private _assemblyDesignationUrl = "./assets/assemblyDesignations.json";
    private _topAssemblyUrl="";

    constructor(private _http: Http){}


    //get the list of assemblies
    getAssemblies():Observable<IAssembly[]>{
        return this._http.get(this._assemblyUrl)
        .map((response: Response) => <IAssembly[]> response.json())
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

    //get the list of designations suitable for supplied assembly
    getAssemblyDesignations(assemblyId:number):Observable<IAssemblyDesignation[]>{
        return this._http.get(this._assemblyDesignationUrl)
        .map((response: Response) => (<IAssemblyDesignation[]> response.json())
        .filter(response => response.assemblyId == assemblyId))
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError); 
    }

    //get the list of top level assemblies
    getTopLevelAssemblies():Observable<IAssembly[]>{
        return this._http.get(this._topAssemblyUrl)
        .map((response: Response) => (<IAssembly[]> response.json()))
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }

    //get assembly by Id
    getAssembly(id: number): Observable<IAssembly>{
        let assembly: Observable<IAssembly>;
        assembly= this.getAssemblies().map((assemblies: IAssembly[])=> assemblies.find(a => a.id === id));
        return assembly;
    }

    //create new assembly 
    createAssembly(){

    }

    //update existing Assembly
    updateAssembly(){}

    //delete existing Assembly
    deleteAssembly(assemblyId:number){}

    //add designation 
    addAssemblyDesignation(){}

    //delete designation from Assembly
    deleteAssemblyDesignation(){}

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}