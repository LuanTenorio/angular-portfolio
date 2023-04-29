import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapeCourseModel } from './model/cape-course.model';
import { ResponseCapesCourseDto } from './dto/response-cape-course.dto';
import { catchError, map } from 'rxjs';
import { ResponseCourseDto } from './dto/response-course.dto';
import { CourseModel } from './model/course.model';
import { CreateCouseDto } from './dto/create-course.dto';
import { PatchCourseDto } from './dto/patchCourse.dto';
import { ResponseGenericDelete } from '../dto/response-generic-delete.dto';
import { AbstractOrderDto } from '../dto/abstract-order.dto';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  API = 'http://localhost:3000/api/course/'
  capeCourse: CapeCourseModel[] = []
  courses: CourseModel[] = []
  loaded = false

  constructor(
    private readonly http: HttpClient
  ) { }

  patchOrder = (coursesOrder: AbstractOrderDto) => this.http.patch<ResponseCapesCourseDto>(this.API + 'order', coursesOrder)

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

  addCourse = (createCouseDto: FormData) => this.http.post<ResponseCourseDto>(this.API, createCouseDto)
  patchCourse = (patchCouseDto: FormData, courseId: number) => this.http.patch<ResponseCourseDto>(this.API + courseId, patchCouseDto)
  deleteCourse = (courseId: number) => this.http.delete<ResponseGenericDelete>(this.API + courseId)

  addCourseInArray(course: CourseModel){
    this.courses.find(({id}) => course.id == id) ??
      this.courses.push(course)

    if(!this.capeCourse.find(({id}) => course.id == id)){
      const {name, id, shortDescription, pathImage, order} = course
      this.capeCourse.push({name, id, shortDescription, pathImage, order})
    }
  }

  deleteCourseInArray(courseId: number){
    const index = this.courses.findIndex(({id}) => id == courseId)
    if(index !== -1)
      this.courses.splice(index, 1)

    const indexCape = this.capeCourse.findIndex(({id}) => courseId == id)
    if(indexCape !== -1)
      this.capeCourse.splice(indexCape, 1)
  }

  updateCourseInArray(course: CourseModel){
    const index = this.courses.findIndex(({id}) => course.id == id)
    if(index !== -1)
      this.courses[index] = course

    const indexCape = this.capeCourse.findIndex(({id}) => course.id == id)
    if(indexCape !== -1){
      const {name, id, shortDescription, pathImage, order} = course
      this.capeCourse[indexCape] = {name, id, shortDescription, pathImage, order}
    }

    if(index == -1 && indexCape == -1)
      this.addCourseInArray(course)
  }

}