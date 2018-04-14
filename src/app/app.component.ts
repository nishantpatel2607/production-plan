import { Component } from '@angular/core';
import { Global } from './core/services/global';
//import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor (){ }
  
  get loadingFlag(){
    return Global.loadingFlag;
  }
}
