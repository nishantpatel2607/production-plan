export interface IVMWorkOrderEvent {
    id:number;
    workOrderId: number;
    workOrderNo: string;  
    machineName:string;
    assemblyName: string;
    qty: number;
    title:string; //title to show in planner control
    start:string; //start date time format:'yyyy-MM-ddTHH:mm:ss'
    end:string; //end date time format:'yyyy-MM-ddTHH:mm:ss'
    color:string; //color of work order to be visible on the planner control
    textColor:string;
    isDirty:boolean; //true if new event is added or existing is changed
}