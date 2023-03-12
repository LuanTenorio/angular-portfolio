import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseCapeOfSkillsDto } from './dto/response-cape-of-skill.dto';
import { CapeOfSkillsModel } from './model/cape-of-skill.model';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  API = 'http://localhost:3000/api/information'
  loaded = false
  capeOfSkills?: CapeOfSkillsModel[] = [
    {id: 1, name: 'HTML'},
    {id: 2, name: 'CSS'},
    {id: 3, name: 'JS'},
    {id: 4, name: 'Angular'},
    {id: 5, name: 'NestJs'},
    {id: 6, name: 'git e github'},
  ]

  constructor(
    private readonly http: HttpClient
  ) { }

  getCapeOfSkills = () => this.http.get<ResponseCapeOfSkillsDto>(this.API).pipe(
    map(
      ({capes}) => {
        console.log(capes);

        this.capeOfSkills = capes
        this.loaded = true
        return {capes}
      }
    ),
    catchError(
      (error: HttpErrorResponse) => {
        this.loaded = true
        return 'HttpErrorResponse'
      }
    )
  )

}
