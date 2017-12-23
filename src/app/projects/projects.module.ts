import { OrderService } from '../core/services/order.service';
import { ProjectListComponent } from './project-list/project-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { PagerService } from '../core/services/pager.service';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { Ng2OrderModule } from 'ng2-order-pipe';

@NgModule({ 
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        Ng2OrderModule,
        RouterModule.forChild([
            { path: 'projects', component: ProjectListComponent}
            
        ])
    ],
    declarations:[
        ProjectListComponent
        
        
    ],
    providers:[
        OrderService
    ]
}) 
export class ProjectsModule{}