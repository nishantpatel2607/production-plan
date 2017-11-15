

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MachineFilterPipe } from './machine-list/machine-filter.pipe';
import { PagerService } from '../core/services/pager.service';
import { MachineService } from '../core/services/machine.service';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MachineListComponent } from './machine-list/machine-list.component';
import { MachineFormComponent } from './machine-form/machine-form.component';
import { MachineCategoryComponent } from './machine-category/machine-category.component';
import { MachineCategoryService } from '../core/services/machineCategory.service';
import { MachineModelService } from '../core/services/machineModel.service';


@NgModule({ 
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        
        RouterModule.forChild([
            { path: 'machines', component: MachineListComponent},
            { path: 'machines/new', component: MachineFormComponent},
            { path: 'machine/:id',component: MachineFormComponent},
            { path: 'machinecat',component: MachineCategoryComponent}
        ])
    ],
    declarations:[
        MachineFormComponent,
        MachineListComponent,
        MachineFilterPipe,
        MachineCategoryComponent
        
    ],
    providers:[
        MachineService,
        PagerService,
        MachineCategoryService,
        MachineModelService
      
    ]
})
export class MachinesModule{}