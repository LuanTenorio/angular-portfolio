import { Component } from '@angular/core';
import { CourseModel } from '../model/course.model';
import { CoursesService } from '../courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { filterTag } from '../../tag/util/filter-tag.uitl';
import { SkillsService } from '../../skills/skills.service';
import { ProjectsService } from '../../projects/projects.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent {

  course?: CourseModel
  loaded = false
  isEditable: boolean = this.activatedRoute.snapshot.data['isEditable'] ?? false
  filterTag = filterTag

  constructor(
    private readonly coursesService: CoursesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private location: Location,
    public readonly skillsService: SkillsService,
    public readonly projectsService: ProjectsService
  ){
    const courseId = activatedRoute.snapshot.params['id']
    const curCourse = this.coursesService.courses.find(({id}) => id == courseId)
    if(curCourse){
      this.course = curCourse
      this.loaded = true
    }
    else
      this.coursesService.getCourse(courseId).subscribe(
        ({course}) => {
          this.course = course
          this.loaded = true
        },
        (error: HttpErrorResponse) => {
          this.location.back()
        }
      )
  }

  redirectToEdit(){
    const id: number = this.activatedRoute.snapshot.params['id']
    if(id && this.isEditable)
      this.router.navigate(['painel', 'editar', 'curso', id])
  }
}
