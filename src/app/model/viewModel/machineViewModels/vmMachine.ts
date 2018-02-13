import { IVMMachineAssembly } from "./vmMachineAssembly";

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
}