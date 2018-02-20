export interface IWorkOrderPlan{
    id:number;
    workOrderId: number;
    plannedStartDateTime: string;
    plannedEndDateTime: string;
    actualStartDateTime: string;
    actualEndDateTime: string;
}
