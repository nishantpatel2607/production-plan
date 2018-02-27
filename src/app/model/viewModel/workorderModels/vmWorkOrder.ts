import { IVMMachineListItem } from "../machineViewModels/vmMachine";
import { IVMAssemblyListItem } from "../assemblyViewModels/vmAssembly";

export interface IVMWorkOrder{
    id:number;
    workOrderNo: string;
    workOrderDate: string;
    machine:IVMMachineListItem;
    assembly: IVMAssemblyListItem;
    qty: number;
}

export interface IVMWorkOrderListItem{
    id:number;
    workOrderNo: string;
    workOrderDate: string;
    machineName:string;
    assemblyName: string;
    qty: number;
}