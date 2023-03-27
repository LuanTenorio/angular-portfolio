import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapeCourseModel } from './model/cape-course.model';
import { ResponseCapesCourseDto } from './dto/response-cape-course.dto';
import { catchError, map } from 'rxjs';
import { ResponseCourseDto } from './dto/response-course.dto';
import { CourseModel } from './model/course.model';
import { CreateCouseDto } from './dto/create-course.dto';
import { PatchCourseDto } from './dto/patchCourse.dto';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  API = 'http://localhost:3000/api/course/'
  capeCourse: CapeCourseModel[] = [
    {id: 1, name: 'Angular', cover: 'pathhhhhhhhhhhhhhh', shortDescription: 'descriptionnnnnnnnnnnnnnnnnnnnnnnnnnn'},
    {id: 2, name: 'NestJs', cover: 'pathhhhhhhhhhhhhhh', shortDescription: 'descriptionnnnnnnnnnnnnnnnnnnnnnnnnnn'},
    {id: 3, name: 'SQL', cover: 'pathhhhhhhhhhhhhhh', shortDescription: 'descriptionnnnnnnnnnnnnnnnnnnnnnnnnnn'}
  ]
  courses: CourseModel[] = []
  loaded = false

  constructor(
    private readonly http: HttpClient
  ) { }

  getCapeCourses = () => this.http.get<ResponseCapesCourseDto>(this.API + 'capes').pipe(
    map(
      ({capes}) => {
        console.log(capes);

        this.capeCourse = capes
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

  getCourse = (courseId: number) => this.http.get<ResponseCourseDto>(this.API + courseId).pipe(
    map(({course}) => {
      this.addCourseInArray(course)
      return {course}
    })
  )

  addCourse = (createCouseDto: CreateCouseDto) => this.http.post<ResponseCourseDto>(this.API, createCouseDto).pipe(
    map(({course}) => {
      this.addCourseInArray(course)
      return {course}
    })
  )

  patchCourse = (patchCouseDto: PatchCourseDto) => this.http.post<ResponseCourseDto>(this.API, patchCouseDto).pipe(
    map(({course}) => {
      this.updateCourseInArray(course)
      return {course}
    })
  )

  deleteCourse = (courseId: number) => this.http.get<number>(this.API + courseId).pipe(
    map(id => {
      this.deleteCourseInArray(id)
      return id
    })
  )

  private addCourseInArray(course: CourseModel){
    this.courses.find(({id}) => course.id == id) ??
      this.courses.push(course)
  }

  private deleteCourseInArray(courseId: number){
    const index = this.courses.findIndex(({id}) => id == courseId)
    if(index !== -1)
      this.courses.splice(index, 1)
  }

  private updateCourseInArray(course: CourseModel){
    const index = this.courses.findIndex(({id}) => course.id == id)
    if(index !== -1)
      this.courses[index] = course
    else
      this.courses.push(course)
  }

}