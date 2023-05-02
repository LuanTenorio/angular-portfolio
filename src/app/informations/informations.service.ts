import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InformationModel } from './model/information.model';
import { PatchInformationDto } from './dto/patch-information.dto';
import { Subject, catchError, map } from 'rxjs';
import { ResponseInformationDto } from './dto/response-information.dto';

@Injectable({
  providedIn: 'root'
})
export class InformationsService {

  API = '/api/information/'
  loaded = false
  information?: InformationModel
  loadedObservable = new Subject<boolean>()

  constructor(
    private readonly http: HttpClient
  ) { }

  getInformations = () => this.http.get<ResponseInformationDto>(this.API).pipe(
    map(
      ({information}) => {
        this.information = information
        this.loadedObservable.next(true)
        this.loaded = true
        return {information}
      }
    ),
    catchError(
      (error: HttpErrorResponse) => {
        this.loadedObservable.next(false)
        this.loaded = true
        return 'HttpErrorResponse'
      }
    )
  )

  patchInformations = (patchInformations: FormData) => this.http.patch<ResponseInformationDto>(this.API, patchInformations)

}