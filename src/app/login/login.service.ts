import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { loginDto } from './dto/login.dto';
import { ResponseLoginDto } from './dto/response-login.dto';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  API = 'http://localhost:3000/api/user/login'

  constructor(
    private readonly http: HttpClient
  ) { }

  login = (loginDto: loginDto) => this.http.post<ResponseLoginDto>(this.API, loginDto)
  insertToken = (token: string) => localStorage.setItem('jwt_token', token)

}
