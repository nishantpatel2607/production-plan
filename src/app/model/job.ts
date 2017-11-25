export interface IJob{
    id: number;
    jobName: string;
    jobSequenceNo: number;
    jobDescription: string;
    parentJobId: number;
    durationInMins: number;
    
    
}