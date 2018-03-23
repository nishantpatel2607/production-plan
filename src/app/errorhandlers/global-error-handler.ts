import { ErrorHandler } from "@angular/core";

export class AppErrorHandler implements ErrorHandler{
    handleError(error) {
        alert('some unexpected error occured');
        console.log(error); }
}