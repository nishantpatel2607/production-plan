export interface IJob{
    id: number;
    jobName: string;
    machineId:number;
    jobSequenceNo: number;
    jobDescription: string;
    parentJobId: number;
    durationInMins: number;
 }