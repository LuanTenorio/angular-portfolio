import { Component } from '@angular/core';
import { ProjectsService } from '../projects.service';
import { ProjectModel } from '../model/project.model';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectImageModel } from '../model/project-image.model';
import { filterTag } from '../../tag/util/filter-tag.uitl';
import { CoursesService } from '../../courses/courses.service';
import { SkillsService } from '../../skills/skills.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {

  project?: ProjectModel
  loaded = false
  isEditable: boolean = this.activatedRoute.snapshot.data['isEditable'] ?? false
  filterTag = filterTag

  constructor(
    public readonly projectsService: ProjectsService,
    public readonly coursesService: CoursesService,
    public readonly skillsService: SkillsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ){
    const id = activatedRoute.snapshot.params['id']
    const curProject = this.projectsService.getProjectByProjects(id)
    console.log(curProject)
    if(curProject){
      console.log('do arayyyyyyyyyy')
      this.project = curProject
      this.loaded = true
      console.log(this.project)
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

  redirectToEdit(){
    const id: number = this.activatedRoute.snapshot.params['id']
    if(id && this.isEditable)
      this.router.navigate(['painel', 'editar', 'projeto', id])
  }

}
