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
import { IVMAssembly, IVMAssemblyListItem } from '../../model/viewModel/assemblyViewModels/vmAssembly';

@Injectable()
export class AssemblyService{
    private _assemblyUrl = "./assets/assemblies.json";
    private _assemblyListUrl = "./assets/assemblyList.json";
    private _assemblyDesignationUrl = "./assets/assemblyDesignations.json";
    private _vmAssemblyUrl = "./assets/vmAssemblies.json";
    private _topAssemblyUrl="";

    constructor(private _http: Http){}


    //get the list of assemblies
    getAssemblies():Observable<IAssembly[]>{
        return this._http.get(this._assemblyUrl)
        .map((response: Response) => <IAssembly[]> response.json())
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
        .catch(this.handleError);
    }


    //get the list of assemblies (id and assembly name only)
    getAssemblyList():Observable<IVMAssemblyListItem[]>{
       return this._http.get(this._assemblyListUrl)
        .map((response: Response) => <IVMAssemblyListItem[]> response.json())
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
    getAssembly(id: number): Observable<IVMAssembly>{
        let assembly: Observable<IVMAssembly>;
        assembly = (this._http.get(this._vmAssemblyUrl)
        .map((response: Response) => <IVMAssembly[]> response.json()))
        .map((assemblies: IVMAssembly[])=> assemblies.find(a => a.id === id));
        return assembly;
    }

    //create new assembly 
    createAssembly(assembly:IVMAssembly){

    }

    //update existing Assembly
    updateAssembly(assembly:IVMAssembly){}

    //delete existing Assembly
    deleteAssembly(assemblyId:number){}

    

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}