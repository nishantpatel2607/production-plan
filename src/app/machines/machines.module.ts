import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MachineFilterPipe } from './machine-list/machine-filter.pipe';
import { PagerService } from '../core/services/pager.service';
import { MachineService } from '../core/services/machine.service';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MachineListComponent } from './machine-list/machine-list.component';
import { MachineFormComponent } from './machine-form/machine-form.component';



@NgModule({ 
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        RouterModule.forChild([
            { path: 'machines', component: MachineListComponent},
            { path: 'machines/new', component: MachineFormComponent}
        ])
    ],
    declarations:[
        MachineFormComponent,
        MachineListComponent,
        MachineFilterPipe
        
    ],
    providers:[
        MachineService,
        PagerService
    ]
})
export class MachinesModule{}