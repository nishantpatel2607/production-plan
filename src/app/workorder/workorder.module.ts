import { SharedModule } from '../shared/shared.module';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WoPlannerComponent } from './wo-planner/wo-planner.component';
import { NgModule } from '@angular/core';
import { WorkorderFormComponent } from './workorder-form/workorder-form.component';
import { WorkorderListComponent } from './workorder-list/workorder-list.component';
import { DateTimePickerModule } from 'ng-pick-datetime';
import { WorkOrderService } from '../core/services/workorders.service';

@NgModule({  
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        Ng2OrderModule,
        DateTimePickerModule,
        RouterModule.forChild([
            { path: 'workorderlist', component: WorkorderListComponent},
            { path: 'workorder/new', component: WorkorderFormComponent},
            { path: 'woplanner', component: WoPlannerComponent},
            
        ])
    ],
    declarations:[
        WoPlannerComponent,
        WorkorderFormComponent,
        WorkorderListComponent
       ],
    providers:[
        WorkOrderService
        ]
}) 
export class WorkOrderModule{}