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
  projectsCape: ProjectCapeModel[] = [
  {
    id: 1,
    name: 'cepiApp',
    shortDescription: 'Minha descrição curta de teste',
    order: 1,
    cover: 'https://c4.wallpaperflare.com/wallpaper/974/565/254/windows-11-windows-10-minimalism-hd-wallpaper-preview.jpg',
  },
  {
    id: 2,
    name: 'portfolio',
    shortDescription: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
    order: 2,
    cover: 'https://c4.wallpaperflare.com/wallpaper/974/565/254/windows-11-windows-10-minimalism-hd-wallpaper-preview.jpg',
  },
  {
    id: 3,
    name: 'encomendas',
    shortDescription: 'Minha descrição curta de teste',
    order: 3,
    cover: 'https://c4.wallpaperflare.com/wallpaper/974/565/254/windows-11-windows-10-minimalism-hd-wallpaper-preview.jpg',
  },
  ]
  projects: ProjectModel[] = [{
    id: 1,
    name: 'cepiApp',
    order: 1,
    description: 'Minha descrição longa',
    projectImage: [
      {
        id: 1,
        pathImage: 'https://c4.wallpaperflare.com/wallpaper/974/565/254/windows-11-windows-10-minimalism-hd-wallpaper-preview.jpg',
        position: 1,
      },
      {
        id: 2,
        pathImage: 'https://assets.website-files.com/5d6547c38725c03ee34b7183/5dd83906cd7d375be1133a8e_15_cursos_online.jpg',
        position: 2,
      },
    ]
  }]
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
