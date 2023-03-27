import { Injectable } from '@angular/core';
import { ProjectCapeModel } from './model/project-cape.model';
import { ProjectModel } from './model/project.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ResponseProjectDto } from './dto/response-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ResponseCapeProjectsDto } from './dto/response-cape-projects.dto';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  API = 'http://localhost:3000/api/project/'
  projectsCape: ProjectCapeModel[] = []
  projects: ProjectModel[] = []
  loaded = false

  constructor(
    private readonly http: HttpClient
  ){ }

  getCapeProjects = () => this.http.get<ResponseCapeProjectsDto>(this.API + 'capes').pipe(
    map(
      ({capes}) => {
        console.log(capes);

        this.projectsCape = capes
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

  getProject = (id: number) => this.http.get<ResponseProjectDto>(this.API + id).pipe(
    map(({project}) => {
      const index = this.projects.findIndex(curProject => curProject.id == project.id)

      if(index == -1)
        this.projects.push(project)

      return {project}
    })
  )

  getProjectByProjects = (id: number) => this.projects.find(curProject => curProject.id == id)

  addProject = (createPorject: CreateProjectDto) => this.http.post<ResponseProjectDto>(this.API, createPorject)

}
