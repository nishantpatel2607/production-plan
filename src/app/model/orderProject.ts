export interface IWorkOrderProject{
    id: number,
    workOrderId:number,
    jobId:number,
    jobName: string,
    jobDesignations: string[],
    parentProjectId:number 
}