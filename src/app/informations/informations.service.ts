import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InformationModel } from './model/information.model';
import { PatchInformationDto } from './dto/patch-information.dto';
import { catchError, map } from 'rxjs';
import { ResponseInformationDto } from './dto/response-information.dto';

@Injectable({
  providedIn: 'root'
})
export class InformationsService {

  API = 'http://localhost:3000/api/information'
  loaded = false
  information?: InformationModel

  constructor(
    private readonly http: HttpClient
  ) { }

  getInformations = () => this.http.get<ResponseInformationDto>(this.API).pipe(
    map(
      ({information}) => {
        console.log(information);

        this.information = information
        this.loaded = true
        return {information}
      }
    ),
    catchError(
      (error: HttpErrorResponse) => {
        this.loaded = true
        return 'HttpErrorResponse'
      }
    )
  )

  patchInformations = (patchInformations: PatchInformationDto) => this.http.patch<ResponseInformationDto>(this.API, patchInformations)

}