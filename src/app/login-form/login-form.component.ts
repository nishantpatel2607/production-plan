import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  form; 
  
  constructor(fb: FormBuilder,private router: Router) {
    this.form = fb.group({
      userName: ['', Validators.required],
      passWord: ['',Validators.required]
    });
   }

  ngOnInit() {
  }

  login(){
    
    this.router.navigate(['/home']);
  }

  get userName(){
    return this.form.get("userName");
  }

  get passWord(){
    return this.form.get("passWord");
  }
}
