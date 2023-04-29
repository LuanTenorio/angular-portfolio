import { Injectable } from '@angular/core';
import { ProjectCapeModel } from './model/project-cape.model';
import { ProjectModel } from './model/project.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ResponseProjectDto } from './dto/response-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { ResponseCapeProjectsDto } from './dto/response-cape-projects.dto';
import { catchError, map } from 'rxjs';
import { ResponseGenericDelete } from '../dto/response-generic-delete.dto';
import { AbstractOrderDto } from '../dto/abstract-order.dto';

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

  patchOrder = (projectsOrder: AbstractOrderDto) => this.http.put<ResponseCapeProjectsDto>(this.API + 'order', projectsOrder)

  getCapeProjects = () => this.http.get<ResponseCapeProjectsDto>(this.API + 'capes').pipe(
    map(
      ({capes}) => {
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
      this.addProjectInArray(project)
      return {project}
    })
  )

  getProjectByProjects = (id: number) => this.projects.find(curProject => curProject.id == id)

  addProject = (createPorject: FormData) => this.http.post<ResponseProjectDto>(this.API, createPorject)

  patchProject = (projectId: number, patchPorject: FormData) => this.http.patch<ResponseProjectDto>(this.API + projectId, patchPorject)

  deleteProject = (projectId: number) => this.http.delete<ResponseGenericDelete>(this.API + projectId)

  private addProjectInArray(project: ProjectModel){
    this.projects.find(({id}) => project.id == id) ??
      this.projects.push(project)

    if(!this.projectsCape.find(({id}) => project.id == id)){
      const {name, id, shortDescription, order} = project
      this.projectsCape.push({
        name,
        id,
        shortDescription,
        order,
        cover: project.projectImage[0].pathImage,
      })
    }
  }

  deleteProjectInArray(projectId: number){
    const index = this.projects.findIndex(({id}) => id == projectId)
    if(index !== -1)
      this.projects.splice(index, 1)

    const indexCape = this.projectsCape.findIndex(({id}) => projectId == id)
    if(indexCape !== -1)
      this.projectsCape.splice(indexCape, 1)
  }

  updateProjectInArray(project: ProjectModel){
    const index = this.projects.findIndex(({id}) => project.id == id)
    if(index !== -1)
      this.projects[index] = project

    const indexCape = this.projectsCape.findIndex(({id}) => project.id == id)
    if(indexCape !== -1){
      const {name, id, shortDescription, order} = project
      this.projectsCape[indexCape] = {name, id, shortDescription, cover: project.projectImage?.length > 0 ?  project.projectImage[0].pathImage : '', order}
    }

    if(index == -1 || indexCape == -1)
      this.addProjectInArray(project)
  }

}
