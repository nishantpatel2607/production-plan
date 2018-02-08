import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-assembly-form',
  templateUrl: './assembly-form.component.html',
  styleUrls: ['./assembly-form.component.css']
})
export class AssemblyFormComponent implements OnInit {

  form: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      assemblyName: ['', Validators.required],
      assemblyDescription: [],
      durationInMins: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      designations: this.fb.array([ ]),
      subAssemblies: this.fb.array([])
    });
   }

  ngOnInit() {
  }

  addAssembly(assembly){
    alert(assembly.assemblyName);
  }

}
