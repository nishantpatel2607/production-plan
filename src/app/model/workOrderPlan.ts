export interface IWorkOrderPlan{
    id:number;
    workOrderId: number;
    plannedStartDate: string; //Date format: "MM/dd/yyyy"
    plannedEndDate: string; //Date format: "MM/dd/yyyy"
    plannedStartTime: string; //Time in 24 Hr format "HH:mm:ss"
    plannedEndTime: string; //Time in 24 Hr format "HH:mm:ss"
    actualStartDate: string; //Date format: "MM/dd/yyyy"
    actualEndDate: string; //Date format: "MM/dd/yyyy"
    actualStartTime: string; //Time in 24 Hr format "HH:mm:ss"
    actualEndTime: string; //Time in 24 Hr format "HH:mm:ss"
}
