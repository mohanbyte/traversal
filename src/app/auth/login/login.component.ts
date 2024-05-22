import { HttpClient } from '@angular/common/http';
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
    email: new FormControl(""),
    password: new FormControl("")
  })
  constructor(private router : Router, private httpclient : HttpClient){


  }
  login(){
    this.router.navigate(['dashboard'])
  }
  signup(){
    const req = this.loginForm.value
    this.httpclient.post('http://localhost:3002/api/signup', req).subscribe((res)=>{
      console.log(res)
    })
  }
}
