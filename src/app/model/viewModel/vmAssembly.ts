import { IAssemblyDesignation } from "../assemblyDesignations";
import { ISubAssembly } from "../subAssembly";

export interface IVMAssembly { 
    id: number;
    assemblyName: string;
    assemblyDescription: string;
    durationInMins: number;
    assemblyDesignations:IAssemblyDesignation[];
    subAssemblies:ISubAssembly[];
 }