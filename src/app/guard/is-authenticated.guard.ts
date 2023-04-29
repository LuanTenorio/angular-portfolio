import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { decodeJwtUtil } from '../util/validate-jwt.util';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivate {

  constructor(private router: Router, private alertService: AlertService) { }

  canActivate(){
    const jwt = localStorage.getItem('token')
    const payload = decodeJwtUtil(jwt ?? '')
    const isAuthenticated = payload !== undefined && payload.exp < new Date().getTime()

    console.log({jwt, payload, isAuthenticated})
    if(isAuthenticated)
      return isAuthenticated

    this.router.navigateByUrl('/login')
    this.alertService.addAlert('Não authenticado')

    return false
  }
}