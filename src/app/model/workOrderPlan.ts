export interface IWorkOrderPlan{
    id:number;
    workOrderId: number;
    plannedStartDate: string;
    plannedEndDate: string;
    plannedStartTime: string;
    plannedEndTime: string;
    actualStartDate: string;
    actualEndDate: string;
    actualStartTime: string;
    actualEndTime: string;
}
