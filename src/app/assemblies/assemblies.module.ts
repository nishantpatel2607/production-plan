import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssemblyListComponent } from './assembly-list/assembly-list.component';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { AssemblyService } from '../core/services/assembly.service';
import { AssemblySelectorComponent } from './assembly-selector/assembly-selector.component';
import { AssemblyFormComponent } from './assembly-form/assembly-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    Ng2OrderModule,
    RouterModule.forChild([
      { path: 'assemblies', component: AssemblyListComponent},
      { path: 'assemblies/new', component: AssemblyFormComponent},
  ])
  ],
  declarations: [AssemblyListComponent, AssemblySelectorComponent, AssemblyFormComponent],
  providers:[AssemblyService]
})
export class AssembliesModule { }
