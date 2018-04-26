import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService } from '../core/services/employee.service';

import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { DesignationListComponent } from './designation-list/designation-list.component';
import { DesignationService } from '../core/services/designation.service';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { GrowlModule } from 'primeng/growl';
//import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
//import { LoadingService } from '../core/services/loading.service';

@NgModule({
    imports: [
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        Ng2OrderModule,
        GrowlModule,
        RouterModule.forChild([
            {path: 'designations',component:DesignationListComponent},
            { path: 'employees', component: EmployeeListComponent},
            { path: 'employees/new', component: EmployeeFormComponent},
            { path: 'employee/:id',component: EmployeeFormComponent}
        ])
       /*  LoadingModule.forRoot({
            animationType: ANIMATION_TYPES.threeBounce,
              backdropBackgroundColour: 'rgba(0,0,0,0.1)', 
              backdropBorderRadius: '0px',
              primaryColour: 'red', 
              secondaryColour: 'green', 
              tertiaryColour: 'blue'
          })   */
    ],
    declarations:[
        EmployeeFormComponent,
        EmployeeListComponent,
        DesignationListComponent
    ],
    providers: [
        EmployeeService,
        DesignationService
        
    ]
})
export class EmployeesModule{}