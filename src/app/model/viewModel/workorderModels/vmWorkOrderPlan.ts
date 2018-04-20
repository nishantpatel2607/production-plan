export interface IVMWorkOrderPlan{
    id:number; 
    workOrderId: number; 
    workOrderNo: string;
    machineName:string;
    assemblyName: string;
    qty: number;
    plannedStartDate: string; //Date format: "YYYY-MM-DD"
    plannedEndDate: string; //Date format: "YYYY-MM-DD" 
    plannedStartTime: string; //Time in 24 Hr format "HH:mm:ss"
    plannedEndTime: string; //Time in 24 Hr format "HH:mm:ss"
    actualStartDate: string; //Date format: "YYYY-MM-DD"
    actualEndDate: string; //Date format: "YYYY-MM-DD"
    actualStartTime: string; //Time in 24 Hr format "HH:mm:ss"
    actualEndTime: string; //Time in 24 Hr format "HH:mm:ss"
}
