import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from '../../alert/alert.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  form: FormGroup
  loading = false

  constructor(
    private readonly fb: FormBuilder,
    private readonly loginService: LoginService,
    private readonly router: Router,
    private readonly alertService: AlertService
  ){

    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })

  }

  login(){
    if(this.form.valid){
      const login = {
        email: this.form.value['email'],
        password: this.form.value['password']
      }

      this.loading = true

      this.loginService.login(login).subscribe(
        ({token}) => {
          console.log(token);
          this.loginService.insertToken(token)
          this.loading = false
          this.router.navigate(['/painel'])
        },
        (error: HttpErrorResponse) => {
          this.loading = false
          if(error.status == 401)
            this.alertService.addAlert('Email ou senha invalidos')
        }
      )
    }else
      this.alertService.addAlert('Formulário invalido');
  }

}
