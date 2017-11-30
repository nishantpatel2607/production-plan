import { JobService } from '../core/services/job.service';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { JobFormComponent } from './job-form/job-form.component';
import { TreeModule } from 'angular-tree-component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TreeModule,
    RouterModule.forChild([
      { path: 'jobs', component: JobFormComponent }

    ])
  ],
  declarations: [
    JobFormComponent
    ],
    providers:[JobService]
})
export class JobsModule { }
