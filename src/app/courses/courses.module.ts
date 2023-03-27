import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses/courses.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { TagModule } from '../tag/tag.module';
import { PageModule } from '../page/page.module';
import { CourseComponent } from './course/course.component';
import { AddCourseComponent } from './add-course/add-course.component';

@NgModule({
  declarations: [
    CoursesComponent,
    CourseComponent,
    AddCourseComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    ReactiveFormsModule,
    TagModule,
    PageModule,
  ],
  exports: [
    CoursesComponent
  ]
})
export class CoursesModule { }
