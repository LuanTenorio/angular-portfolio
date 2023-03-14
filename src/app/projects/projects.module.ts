import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectComponent } from './project/project.component';
import { AddProjectComponent } from './add-project/add-project.component';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectComponent,
    AddProjectComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ProjectsComponent
  ]
})
export class ProjectsModule { }
