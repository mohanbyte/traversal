import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hide = true
  loginForm = new FormGroup({
    username: new FormControl(""),
    password: new FormControl("")
  })
  constructor(private router : Router){


  }
  login(){
    this.router.navigate(['dashboard'])
  }
}
