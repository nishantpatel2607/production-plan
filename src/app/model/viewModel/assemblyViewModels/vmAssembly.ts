import { IVMSubAssembly } from "./vmSubAssembly";
import { IVMAssemblyDesignation } from "./vmAssemblyDesignation";

export interface IVMAssembly { 
    id: number;
    assemblyName: string;
    assemblyDescription: string;
    duration: number;
    assemblyDesignations:IVMAssemblyDesignation[];
    subAssemblies:IVMSubAssembly[];
 }

 export interface IVMAssemblyListItem{
    id: number;
    assemblyName: string;
 }