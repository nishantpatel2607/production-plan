import { IVMWorkOrderTeam } from "./vmWorkOrderTeam";
import { IWorkOrderPlan } from "../../workOrderPlan";
import { IVMMachineListItem } from "../machineViewModels/vmMachine";
import { IVMAssemblyListItem } from "../assemblyViewModels/vmAssembly";

export interface IVMWorkOrder{
    id:number;
    workOrderNo: string;
    workOrderDate: string;
    machine:IVMMachineListItem;
    assembly: IVMAssemblyListItem;
    qty: number;
    team:IVMWorkOrderTeam[];
    schedule:IWorkOrderPlan[];
}