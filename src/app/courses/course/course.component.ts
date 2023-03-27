import { Component } from '@angular/core';
import { CourseModel } from '../model/course.model';
import { CoursesService } from '../courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent {

  course?: CourseModel
  loaded = false

  constructor(
    private readonly coursesService: CoursesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private location: Location
  ){
    const courseId = activatedRoute.snapshot.params['id']
    const curCourse = this.coursesService.courses.find(({id}) => id == courseId)
    if(curCourse){
      console.log('do arayyyyyyyyyy')
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

}
