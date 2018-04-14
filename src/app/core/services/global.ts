export class Global{
    static apiUrl: string = "http://localhost:49542/api/";
    static loadingFlag : boolean = false;

    static  setLoadingFlag(value:boolean){
        setTimeout(() => {
         this.loadingFlag = value; 
        });
      }
}