import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectComponent } from './project/project.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { PageModule } from '../page/page.module';
import { TagModule } from '../tag/tag.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectComponent,
    AddProjectComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule,
    ReactiveFormsModule,
    TagModule,
    PageModule,
    DragDropModule
  ],
  exports: [
    ProjectsComponent
  ]
})
export class ProjectsModule { }
