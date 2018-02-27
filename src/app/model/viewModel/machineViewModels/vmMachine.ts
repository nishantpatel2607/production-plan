import { IVMMachineAssembly } from "./vmMachineAssembly";
import { IVMMachineDesignation } from "./vmMachineDesignation";

export interface IVMMachine { 
    id: number;
    machineName: string;
    categoryId:number;
    modelNo:string;
    installationType:string;
    orientation: string;
    shape: string;
    doorType: string;
    machineType: string; 
    machineAssemblies: IVMMachineAssembly[];
    machineDesignations:IVMMachineDesignation[];
}

export interface IVMMachineListItem {  
    id: number;
    machineName: string;  //machine name + model no
   
}