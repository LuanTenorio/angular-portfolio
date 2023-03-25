import { Component } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { ProjectModel } from '../model/project.model';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectImageModel } from '../model/project-image.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {

  project?: ProjectModel
  loaded = false

  constructor(
    public readonly projectsService: ProjectsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ){
    const id = activatedRoute.snapshot.params['id']
    const curProject = this.projectsService.getProjectByProjects(id)
    if(curProject){
      console.log('do arayyyyyyyyyy')
      this.project = curProject
      this.loaded = true
    }
    else
      this.projectsService.getProject(id).subscribe(
        ({project}) => {
          this.project = project
          this.loaded = true
        },
        (error: HttpErrorResponse) => {
          // this.router.
        }
      )
  }

  pathsTreatment = (paths: ProjectImageModel[]) => paths.map(path => path.pathImage)

}
